import React, { createContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedStreak = localStorage.getItem("streak");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setUser(parsedUser);
          if (storedStreak) {
            setStreak(parseInt(storedStreak));
          }
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data?.id) {
        const userProfile = await api.get(`/users/${response.data.id}`);
        const userData = {
          id: userProfile.data.id,
          name: userProfile.data.name,
          email: userProfile.data.email,
          streak: userProfile.data.streak,
          tasks_completed_today: userProfile.data.tasks_completed_today || 0,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("streak", userData.streak);
        setUser(userData);
        setStreak(userData.streak);

        if (userData.streak === 5 || userData.streak === 10 || userData.streak === 30) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }

        return { success: true };
      }
      return { success: false, error: "Invalid user data received" };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setStreak(0);
    localStorage.removeItem("user");
    localStorage.removeItem("streak");
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/users/${user.id}`);
      const updatedUser = {
        ...user,
        tasks_completed_today: res.data.tasks_completed_today || 0,
        streak: res.data.streak || 0,
      };
      setUser(updatedUser);
      setStreak(updatedUser.streak);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("streak", updatedUser.streak);
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        streak,
        setStreak,
        showConfetti,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
