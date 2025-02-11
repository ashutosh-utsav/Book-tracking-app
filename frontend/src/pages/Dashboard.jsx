import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);

  return (
    // console.log("token", localStorage.getItem("token")),
    
    
    <div>
      <h2>Welcome to Your Dashboard 🎉</h2>
      <p>You have successfully logged in!</p>
      <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
