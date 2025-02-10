import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "@/api/axios";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount and token refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        // Only clear user state for actual auth failures
        if (err.response?.status === 401) {
          setUser(null);
          console.log("User not authenticated");
        } else {
          // For network errors, keep existing user state
          console.log("Auth check failed:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Modify login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      setUser(data.user);
      return data.user;
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
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
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
  const resetPassword = async (email) => {
    try {
      setError(null);
      await api.post("/api/auth/reset-password", { email });
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
