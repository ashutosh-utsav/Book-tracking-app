import express from "express";
import { addBook, getBooks, addToReadingList } from "../controllers/bookController.js";

const router = express.Router();

router.post("/add", addBook);
router.get("/", getBooks);
router.post("/update-status", addToReadingList);

export default router;