import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  const location = useLocation();

  if (loading) {
    return <h1>Loading , please wait</h1>;
  }

  if (!user) {
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoutes;
