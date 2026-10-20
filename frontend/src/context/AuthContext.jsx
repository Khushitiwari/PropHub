// Stores logged-in user, token, and auth actions for the whole app.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { setAccountBlockedHandler } from "../api/client.js";
import { getApiErrorMessage } from "../api/errors.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Remove token and user from storage, go to login page
  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // Load user from storage on refresh; if admin blocks user, api client calls logout
  useEffect(() => {
    if (token) {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    setLoading(false);
    setAccountBlockedHandler(logout);
    return () => setAccountBlockedHandler(null);
  }, [token]);

  // Call backend login and save token + user in localStorage
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: newToken, user: loggedInUser } = res.data;

      setToken(newToken);
      setUser(loggedInUser);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, "Login Denied or Failed"),
      };
    }
  };

  // Create account (user still needs to verify email before login)
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      return {
        success: true,
        message: res.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, "Registration failed"),
      };
    }
  };

  // Fetch latest user from server (e.g. after admin approves seller)
  const refreshUser = async () => {
    if (!token) return;

    try {
      const res = await api.get("/auth/me");

      if (res.data.success) {
        const updateUser = res.data.user;
        setUser(updateUser);

        const storage = localStorage.getItem("token")
          ? localStorage
          : sessionStorage;

        storage.setItem("user", JSON.stringify(updateUser));
      }
    } catch (error) {
      console.log(
        "Failed to refresh user:",
        error.response?.status,
        error.response?.data,
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to read auth state in any component
export const useAuth = () => useContext(AuthContext);
