import Book from "../models/Book.js";

// Add a book
export const addBook = async (req, res) => {
  const { title, author, description, category } = req.body;
  try {
    const book = await Book.create({ title, author, description, category });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a book to a user’s reading list
export const addToReadingList = async (req, res) => {
  const { userId, bookId, status } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.status = status;
    await book.save();
    res.json({ message: "Book status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
