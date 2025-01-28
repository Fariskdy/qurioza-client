import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove token handling from axios defaults
  useEffect(() => {
    axios.defaults.baseURL =
      import.meta.env.VITE_API_URL || "http://localhost:3000";
    axios.defaults.withCredentials = true; // Important for cookies
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Modify login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modify logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put("/api/auth/profile", profileData);
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await axios.post("/api/auth/reset-password", { email });
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setError(null);
      await axios.post(`/api/auth/verify-email/${token}`);
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    verifyEmail,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
