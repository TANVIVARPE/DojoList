import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import api from "./api"; // Axios instance for making HTTP requests
import { toast } from "react-toastify"; // Toast notifications

function ResetPassword() {
  const [password, setPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [token, setToken] = useState(null); // State for reset token
  const navigate = useNavigate();
  const location = useLocation();  // Use useLocation to access the current location

  // Extract token from the URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Get query parameters from the current URL
    setToken(urlParams.get("token"));  // Set the token from the URL
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!"); // Show error if passwords don't match
      return;
    }

    try {
      // Make the POST request to reset the password
      await api.post("http://localhost:8080/auth/password-reset/confirm", { 
        token: token, 
        newPassword: password 
      });
      
      toast.success("Password reset successfully!"); // Show success message
      navigate("/login");  // Redirect to login page after successful password reset
    } catch (error) {
      toast.error("Failed to reset password. Please try again."); // Show error message if the request fails
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
