import mongoose from "mongoose"; // ✅ Make sure this is present

const listSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  books: [{ type: String }] // Storing Google Book IDs directly
});

const List = mongoose.model("List", listSchema);
export default List;
