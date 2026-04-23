import express from 'express';
import bodyparser from 'body-parser';
import db from './db.js';

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
        const result = await db.query("SELECT * FROM books ORDER BY date_read DESC;");

        res.render("index.ejs", { books: result.rows });

    } catch (err) {
        console.log(err);
        res.send("Database error");
    }
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
})

app.post("/add", async (req, res) => {
    try{
        const { title, author, rating, isbn, review, date_read } = req.body;
        await db.query(
            `INSERT INTO books (title, author, rating, review, date_read, isbn)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [title, author, rating, review, date_read || null, isbn]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.send("Error inserting book");
    }
});

// test db
app.get("/test-db", async (req, res) => {
    const result = await db.query("SELECT NOW();");
    res.send(result.rows);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});