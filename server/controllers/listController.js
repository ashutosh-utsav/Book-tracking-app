import List from "../models/List.js";

/**
 * @desc    Get all lists of a user
 * @route   GET /lists/:userId
 * @access  Public
 */
export const getUserLists = async (req, res) => {
  try {
    console.log("Fetching lists for user:", req.params.userId);
    const lists = await List.find({ user: req.params.userId });
    res.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get a single list by ID
 * @route   GET /lists/single/:listId
 * @access  Public
 */
export const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.json(list);
  } catch (error) {
    console.error("Error fetching list:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Create a new list
 * @route   POST /lists
 * @access  Public
 */
export const createList = async (req, res) => {
  const { userId, name, books } = req.body;
  try {
    console.log("Creating new list for user:", userId);
    const newList = new List({ user: userId, name, books });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    console.error("Error creating list:", error.message);
    res.status(500).json({ error: "Error creating list" });
  }
};

/**
 * @desc    Update a list (rename or modify books)
 * @route   PUT /lists/:listId
 * @access  Public
 */
export const updateList = async (req, res) => {
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
};

/**
 * @desc    Delete a list
 * @route   DELETE /lists/:listId
 * @access  Public
 */
export const deleteList = async (req, res) => {
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
};
