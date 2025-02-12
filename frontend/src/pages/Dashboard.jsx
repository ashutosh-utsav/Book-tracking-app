import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [lists, setLists] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedList, setSelectedList] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch User Lists
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/lists/${userId}`)
      .then((res) => res.json())
      .then((data) => setLists(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching lists:", err));
  }, [userId]);

  // Fetch Trending Books
  useEffect(() => {
    fetch("http://localhost:5000/lists/trending")
      .then((res) => res.json())
      .then((data) => setTrendingBooks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  // Search Books in Google Books API
  const searchBooks = () => {
    if (!searchQuery.trim()) return;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => setSearchResults(data.items || []))
      .catch((err) => console.error("Error fetching search results:", err));
  };

  // Create New List
  const createList = () => {
    if (!userId) return;

    fetch("http://localhost:5000/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name: newListName, books: [] }),
    })
      .then((res) => res.json())
      .then((data) => setLists((prevLists) => [...prevLists, data]))
      .catch((err) => console.error("Error creating list:", err));
  };

  // Add Book to Selected List
  const addBookToList = (book, listId) => {
    if (!listId) {
      alert("Please select a list first!");
      return;
    }

    fetch(`http://localhost:5000/lists/${listId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ["Unknown"],
        link: book.volumeInfo.infoLink,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Book added successfully!");
        console.log("Updated List:", data);
      })
      .catch((err) => console.error("Error adding book to list:", err));
  };

  return (
    <div>
      {/* Header with Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome to Your Dashboard 🎉</h2>
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px" }}>
          Logout
        </button>
      </div>

      {/* Search Section */}
      <h3>Search Books 📖</h3>
      <input
        type="text"
        placeholder="Search for a book..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchBooks}>Search</button>

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((book) => (
              <li key={book.id}>
                <strong>{book.volumeInfo.title}</strong> by {book.volumeInfo.authors?.join(", ")}
                <br />
                <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">Read</a>
                <button onClick={() => addBookToList(book, selectedList)}>Add to List</button>
                <button onClick={() => addBookToList(book, "want-to-read")}>Want to Read</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Lists Section */}
      <h3>Your Lists</h3>
      <input type="text" placeholder="New List Name" onChange={(e) => setNewListName(e.target.value)} />
      <button onClick={createList}>Create List</button>
      {lists.length > 0 ? (
        <>
          <select onChange={(e) => setSelectedList(e.target.value)}>
            <option value="">Select a list</option>
            {lists.map((list) => (
              <option key={list._id} value={list._id}>{list.name}</option>
            ))}
          </select>
          <ul>
            {lists.map((list) => (
              <li key={list._id}>{list.name}</li>
            ))}
          </ul>
        </>
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
              <br />
              
              {/* <button onClick={() => addBookToList(book, selectedList)}>Add to List</button> */}
              <button onClick={() => addBookToList(book, "want-to-read")}>Want to Read</button>
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
