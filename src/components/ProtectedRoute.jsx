import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PropTypes from "prop-types";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute rendering", { user, loading });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
