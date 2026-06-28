import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "AGENT") {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (user?.role === "CUSTOMER") {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;