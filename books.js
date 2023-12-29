import express from 'express';
import { config } from './config.js';
import Database from './database.js';
console.log(Database,'data')
const router = express.Router();
router.use(express.json());

// Development only - don't do in production
console.log(config);

// Create database object
const database = new Database(config);

router.get('/', async (_, res) => {
  try {
    // Return a list of books
    const books = await database.readAll();
    console.log(`books: ${JSON.stringify(books)}`);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a book
    const book = req.body;
    console.log(`book: ${JSON.stringify(book)}`);
    const rowsAffected = await database.create(book);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get the book with the specified ID
    const bookId = req.params.id;
    console.log(`bookId: ${bookId}`);
    if (bookId) {
      const result = await database.read(bookId);
      console.log(`books: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update the book with the specified ID
    const bookId = req.params.id;
    console.log(`bookId: ${bookId}`);
    const book = req.body;

    if (bookId && book) {
      delete book.id;
      console.log(`book: ${JSON.stringify(book)}`);
      const rowsAffected = await database.update(bookId, book);
      res.status(200).json({ rowsAffected });
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete the book with the specified ID
    const bookId = req.params.id;
    console.log(`bookId: ${bookId}`);

    if (!bookId) {
      res.status(404);
    } else {
      const rowsAffected = await database.delete(bookId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

export default router;