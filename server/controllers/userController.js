// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import List from "../models/List.js";

// // Register User
// export const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
  
//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     // ✅ Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("✅ Hashed Password:", hashedPassword);

//     // ✅ Save user with hashed password
//     const user = await User.create({ name, email, password: hashedPassword });

//     // ✅ Create default lists for the user
//     await List.create({ user: user._id, name: "Want to Read", books: [] });
//     await List.create({ user: user._id, name: "Read", books: [] });

//     console.log("🟢 User registered successfully:", user);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login User
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email }).select("+password"); // ✅ Ensure password is retrieved
//     if (!user) return res.status(400).json({ message: "Invalid email or password" });

//     console.log("📌 Entered Password:", password);
//     console.log("🔍 Stored Hashed Password:", user.password);

//     // ✅ Verify password
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("🔍 Password Match Result:", isMatch);

//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     // ✅ Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     console.log("✅ Login Successful:", { userId: user._id, token });
//     res.json({ token, user });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import List from "../models/List.js";

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    // ✅ Ensure List model is defined before calling .create()
    await List.create({ user: user._id, name: "Want to Read", books: [] });
    await List.create({ user: user._id, name: "Read", books: [] });
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};