import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";
import api from "./api";
import "./AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data?.id) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          daily_goals: response.data.daily_goals || 3,
          tasks_completed_today: response.data.tasks_completed_today || 0,
          streak: response.data.streak || 0,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("streak", userData.streak);
        setUser(userData);

        toast.success("Login successful!");
        setTimeout(() => navigate("/app"), 1000);
      } else {
        toast.error("Invalid user data received.");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        mobileNumber,
      });

      if (response.status === 200) {
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="app-title">Dojolist</h1>
        <p className="app-subtitle">Stay Organized, Stay Ahead!</p>

        <div className="toggle-buttons">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn">Login</button>
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link> {/* Add the link */}
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
