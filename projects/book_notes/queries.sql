CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    rating NUMERIC(3,1) CHECK (rating BETWEEN 1 AND 10),
    review TEXT,
    date_read DATE,
    cover_id TEXT
);

INSERT INTO books
(title, author, rating, review, date_read, cover_id)
VALUES
(
'Atomic Habits',
'James Clear',
10,
'Very practical and actionable.',
'2026-04-20',
10594765
);

INSERT INTO books
(title, author, rating, review, date_read, cover_id)
VALUES
(
'Deep Work',
'Cal Newport',
10,
'Great ideas about focus.',
'2026-04-15',
240726
);