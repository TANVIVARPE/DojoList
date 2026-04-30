import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import Toast from "./Toast";
import "./Navbar.css";
import ReactConfetti from "react-confetti";

function Navbar({ completedToday, streak }) {
  const { user, logout, showConfetti } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    logout();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/");
    }, 2000);
  };

  return (
    <nav className="navbar">
      <div>
        <h3>Hello, {user ? user.name : "Guest"} 👋</h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div className="navbar-progress">
          <span>
            🔥 Streak: {streak !== undefined ? streak : 0}{" "}
            {streak === 1 ? "day" : "days"}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="logout-btn"
            aria-label="Logout">
            Logout
          </button>
        )}
      </div>

      {showToast && <Toast message="Logged out successfully ✅" />}
      {showConfetti && <ReactConfetti />}
    </nav>
  );
}

export default Navbar;
