import express from 'express';
import bodyparser from 'body-parser';
import db from './db.js';       // import from local file for database

const app = express();
const port = 3000;

// middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// home
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY date_read DESC;");  // sort by recency

        res.render("index.ejs", { books: result.rows });

    } catch (err) {
        console.log(err);
        res.send("Database error");
    }
});

// get route handles to load the create/add new book page
app.get("/add", (req, res) => {
    res.render("add.ejs");
})

// handles submission for create/add new book entry for notes
app.post("/add", async (req, res) => {
    try{
        const { title, author, rating, isbn, notes, date_read } = req.body;
        await db.query(
            `INSERT INTO books (title, author, rating, notes, date_read, isbn)
            VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6)`,
            [title, author, rating, notes, date_read || null, isbn]
        );              // here `COALESCE($5, CURRENT_DATE)` was used to use CURRENT_DATE sql function
                        // to generate date if the user doesn't supply any date. Because `date_read` field in database 
                        // table is of 'DATE' type, passing empty value("") will result in error. Furthermore,
                        // using the default value as 'CURRENT_DATE' in db table doesn't fill the date if I pass
                        // 'null' as the input if user inputs no date. So, the date becomes simply "null", which 
                        // is not as we expected to be the current date is used if no value is passed.
        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.send("Error inserting book");
    }
});

// render the edit page for previously added books 
app.get("/edit/:id", async (req, res) => {
    try{
        const { id } = req.params;

        const result = await db.query(
            "SELECT * FROM books WHERE id = $1", 
            [id]
        );

        res.render("edit.ejs", { 
            book: result.rows[0] 
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading edit page");
    }
});

// handles the form submission for edit page
app.post("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, rating, isbn, notes, date_read } = req.body;

        await db.query(
            `UPDATE books 
            SET 
            title = $1, 
            author = $2,
            rating = $3,
            notes = $4,
            date_read = COALESCE($5, CURRENT_DATE),
            isbn = $6 
            WHERE id = $7;`,
            [title, author, rating, notes, date_read || null, isbn, id]
        );              // ALthough we used "COALESCE($5, CURRENT_DATE)" in add book handler,
                        //  we used it again here because the user might clear the date field and
                        // leave it empty intentionally or unintentionally. But we don't want the 
                        // date field to be empty as we planned.

        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.send("Error Updating!");
    }
});

// delete handler
app.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        await db.query(
            `DELETE FROM books WHERE id = $1;`,
            [id]
        );
    
        res.redirect("/");
        
    } catch (err) {
        console.log(err);
        res.send("Error deleting book!");
    }

});

// test db connection
app.get("/test-db", async (req, res) => {
    const result = await db.query("SELECT NOW();");     // 'current time and date' will be displayed in 
                                                        // browser upon successful database connection
    res.send(result.rows);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});