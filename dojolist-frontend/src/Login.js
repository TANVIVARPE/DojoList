// Login.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";
import api from "./api"; 
import "./Login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Login user
      const response = await api.post("/auth/login", { email, password });

      if (response.data?.id) {
        // ✅ No extra fetch! Use login response data directly
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          daily_goals: response.data.daily_goals || 3,
          tasks_completed_today: response.data.tasks_completed_today || 0,
          streak: response.data.streak || 0,
        };

        // Step 2: Save to localStorage and context
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("streak", userData.streak);

        setUser(userData);

        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/app");
        }, 1000);
      } else {
        toast.error("Invalid user data received.");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="app-title">Dojolist</h1>
        <p className="app-subtitle">Stay Organized, Stay Ahead!</p>

        <h2>Login</h2>
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
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-link">
          New here? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
