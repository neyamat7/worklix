import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/shared/Loading/Loading";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

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
