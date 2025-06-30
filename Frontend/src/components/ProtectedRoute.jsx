import { Navigate } from "react-router-dom";

// A wrapper to protect routes from unauthorized access
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required but doesn't match, redirect
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  // If all checks pass, render the child component(s)
  return children;
};

export default ProtectedRoute;
