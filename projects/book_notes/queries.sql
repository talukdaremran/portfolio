CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    rating NUMERIC(3,1) CHECK (rating BETWEEN 1 AND 10),
    notes TEXT,
    date_read DATE,
    isbn TEXT
);

-- dummy data
INSERT INTO books
(title, author, rating, notes, date_read, isbn)
VALUES
(
'Atomic Habits',
'James Clear',
10,
'Very practical and actionable.',
'2026-04-20',
9781847941831
);

INSERT INTO books
(title, author, rating, notes, date_read, isbn)
VALUES
(
'Deep Work',
'Cal Newport',
10,
'Great ideas about focus.',
'2026-04-15',
9780349411910
);