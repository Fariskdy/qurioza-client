import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "@/api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Only check auth status once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        // Silently fail for public routes
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Simplified logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      // Force reload to clear any cached state
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Modify login function
  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);

      // Get the redirect path from state, or default to dashboard
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });

      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const { data } = await api.put("/auth/profile", profileData);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setError(null);
      await api.post(`/auth/reset-password/${token}`, { password });
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setError(null);
      await api.post(`/api/auth/verify-email/${token}`);
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed");
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error; // Rethrow to handle in the component
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await api.post("/auth/forgot-password", { email });
    } catch (err) {
      setError(err.response?.data?.message || "Password reset request failed");
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
    register,
    forgotPassword,
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
