import { useLocation } from "react-router";
import useAuth from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";

const RiderRoute = ({ children }) => {
  const { user } = useAuth(); // your auth context or provider
  // Fetch role
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  const email = user?.email;

  // If no logged in user, redirect to login
  if (!email) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roleLoading) {
    return <div className="p-4 text-center">Checking permissions...</div>;
  }

  //   if (error) {
  //     return (
  //       <div className="p-4 text-center text-red-500">Error: {error.message}</div>
  //     );
  //   }

  if (user?.email && role !== "rider") {
    return <Navigate to="/dashboard/unauthorized" replace />;
  }

  // User is admin: render protected children
  return children;
};

export default RiderRoute;
