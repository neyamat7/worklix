import { Navigate, useLocation } from "react-router";
import Loading from "../components/shared/Loading/Loading";
import useAuth from "../context/AuthContext";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoutes;
