import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Fetch books from Google Books API
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query; // Get search term from query parameter
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Google Books API URL
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

    // Fetch data from Google Books API
    const response = await axios.get(url);

    // Extract relevant book details
    const books = response.data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ["Unknown Author"],
      description: book.volumeInfo.description || "No description available",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
      publishedDate: book.volumeInfo.publishedDate || "Unknown",
    }));

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
