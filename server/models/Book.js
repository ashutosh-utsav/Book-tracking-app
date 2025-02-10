import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  reviews: [{ user: String, comment: String, rating: Number }],
  status: { type: String, enum: ["to-read", "reading", "read"], default: "to-read" },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
