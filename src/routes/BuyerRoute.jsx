import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import ErrorMessage from "../components/shared/ErrorMessage/ErrorMessage";
import Loading from "../components/shared/Loading/Loading";
import { useUserRole } from "../hooks/useUserRole";

const BuyerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { role, roleLoading, error } = useUserRole();
  const location = useLocation();

  const email = user?.email;

  // If no logged in user, redirect to login
  if (!email) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roleLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (user?.email && role !== "buyer") {
    return <Navigate to="/dashboard/unauthorized" replace />;
  }

  // User is admin: render protected children
  return children;
};

export default BuyerRoute;
