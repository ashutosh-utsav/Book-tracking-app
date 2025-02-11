import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [lists, setLists] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newListName, setNewListName] = useState("");

  const navigate = useNavigate(); // Hook for navigation
  const userId = localStorage.getItem("userId"); 
  console.log("User ID being used:", userId);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  // Fetch User Lists
  useEffect(() => {
    if (!userId) {
      console.warn("No userId found in localStorage! Not fetching lists.");
      return;
    }

    fetch(`http://localhost:5000/lists/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Lists:", data); // Debugging
        setLists(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching lists:", err));
  }, [userId]);

  // Fetch Trending Books
  useEffect(() => {
    fetch("http://localhost:5000/lists/trending")
      .then((res) => res.json())
      .then((data) => setTrendingBooks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  // Create New List
  const createList = () => {
    if (!userId) {
      console.warn("Cannot create list: No userId found.");
      return;
    }

    fetch("http://localhost:5000/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name: newListName, books: [] }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("New List Created:", data); // Debugging
        setLists((prevLists) => [...prevLists, data]);
      })
      .catch((err) => console.error("Error creating list:", err));
  };

  return (
    <div>
      {/* Logout Button in Top-Right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome to Your Dashboard 🎉</h2>
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px" }}>
          Logout
        </button>
      </div>

      {/* User Lists Section */}
      <h3>Your Lists</h3>
      <input type="text" placeholder="New List Name" onChange={(e) => setNewListName(e.target.value)} />
      <button onClick={createList}>Create List</button>
      {lists.length > 0 ? (
        <ul>
          {lists.map((list) => (
            <li key={list._id}>{list.name}</li>
          ))}
        </ul>
      ) : (
        <p>No lists found. Create one!</p>
      )}

      {/* Trending Books Section */}
      <h3>Trending Books 📚</h3>
      {trendingBooks.length > 0 ? (
        <ul>
          {trendingBooks.map((book) => (
            <li key={book.id}>
              <strong>{book.volumeInfo.title}</strong> by {book.volumeInfo.authors?.join(", ")}
            </li>
          ))}
        </ul>
      ) : (
        <p>No trending books available.</p>
      )}
    </div>
  );
};

export default Dashboard;
