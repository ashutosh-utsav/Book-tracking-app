import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      <nav className="navbar">
        <h1>📚 Book Tracker</h1>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      <section className="hero">
        <h2>Track & Discover Your Favorite Books</h2>
        <p>Save books, track reading progress, and explore new reads with ease.</p>
        <Link to="/signup" className="btn">Get Started</Link>
      </section>

      <section className="features">
        <h3>Why Use Our App?</h3>
        <ul>
          <li>🔍 Search Books from Google Books API</li>
          <li>📖 Track Your Reading Progress</li>
          <li>📚 Save Books to Your Collection</li>
        </ul>
      </section>

      <footer className="footer">
        <p>© 2024 Book Tracker</p>
      </footer>
    </div>
  );
};

export default Landing;
