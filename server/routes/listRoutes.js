import express from "express";
import List from "../models/List.js";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const router = express.Router();

/**
 * @desc    Fetch trending books from Google Books API
 * @route   GET /lists/trending
 * @access  Public
 */
router.get("/trending", async (req, res) => {
  try {
    console.log("Fetching trending books...");
    if (!process.env.GOOGLE_BOOKS_API_KEY) {
      throw new Error("Google Books API key is missing!");
    }

    const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=best+books&maxResults=10&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    const response = await axios.get(googleBooksApiUrl);
    
    res.json(response.data.items);
  } catch (error) {
    console.error("Error fetching trending books:", error.message);
    res.status(500).json({ error: "Error fetching trending books" });
  }
});

/**
 * @desc    Get all lists of a user
 * @route   GET /lists/:userId
 * @access  Public
 */
router.get("/:userId", async (req, res) => {
  try {
    console.log("Fetching lists for user:", req.params.userId);
    const lists = await List.find({ user: req.params.userId });

    if (!lists.length) {
      return res.status(404).json({ message: "No lists found for this user" });
    }

    res.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @desc    Get a single list by ID
 * @route   GET /lists/single/:listId
 * @access  Public
 */
router.get("/single/:listId", async (req, res) => {
  try {
    console.log("Fetching list:", req.params.listId);
    const list = await List.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json(list);
  } catch (error) {
    console.error("Error fetching list:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @desc    Create a new list
 * @route   POST /lists
 * @access  Public
 */
router.post("/", async (req, res) => {
    try {
      console.log("Received request body:", req.body); // Debugging
  
      const { userId, name, books } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }
  
      // Ensure `books` is an array of strings (Google Book IDs)
      const bookIds = Array.isArray(books) ? books.map(String) : [];
  
      const newList = new List({ user: userId, name, books: bookIds });
      await newList.save();
      
      res.status(201).json(newList);
    } catch (error) {
      console.error("Error creating list:", error);
      res.status(500).json({ error: error.message });
    }
  });
  

/**
 * @desc    Update a list (rename or modify books)
 * @route   PUT /lists/:listId
 * @access  Public
 */
router.put("/:listId", async (req, res) => {
  const { name, books } = req.body;
  try {
    console.log("Updating list:", req.params.listId);
    const updatedList = await List.findByIdAndUpdate(
      req.params.listId,
      { name, books },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json(updatedList);
  } catch (error) {
    console.error("Error updating list:", error.message);
    res.status(500).json({ error: "Error updating list" });
  }
});

/**
 * @desc    Delete a list
 * @route   DELETE /lists/:listId
 * @access  Public
 */
router.delete("/:listId", async (req, res) => {
  try {
    console.log("Deleting list:", req.params.listId);
    const deletedList = await List.findByIdAndDelete(req.params.listId);

    if (!deletedList) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error.message);
    res.status(500).json({ error: "Error deleting list" });
  }
});

export default router;
