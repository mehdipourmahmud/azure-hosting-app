import express from 'express';
import { config } from './config.js';
import Database from './database.js';

import books from './books.js';
import openapi from './openapi.js';

const port = process.env.PORT || 3000;

const app = express();

// Development only - don't do in production
// Run this to create the table in the database
if (process.env.NODE_ENV === 'development') {
  const database = new Database(config);
  database
    .executeQuery(
      `CREATE TABLE Books (book_id INT PRIMARY KEY,
        title VARCHAR(255),
        author VARCHAR(255),
        genre VARCHAR(50),
        publication_year INT,
        isbn VARCHAR(20));`
    )
    .then(() => {
      console.log('Table created');
    })
    .catch((err) => {
      // Table may already exist
      console.error(`Error creating table: ${err}`);
    });
}

// Connect App routes
app.use('/api-docs', openapi);
app.use('/books', books);
app.use('*', (_, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});






