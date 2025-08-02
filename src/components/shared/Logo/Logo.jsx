import { Link } from "react-router";
import useAuth from "../../../context/AuthContext";
import { useTheme } from "../../../hooks/useTheme";

const Logo = () => {
  const { user, loading } = useAuth();

  const { theme } = useTheme();

  if (loading) return <div>...</div>;

  return (
    <Link to="/" className="flex-shrink-0">
      <button
        className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ${
          user ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {theme === "dark" ? (
          <img className="h-18 w-17 mt-2" src="/light-logo.png" alt="" />
        ) : (
          <img className="h-18 w-17 mt-2" src="/dark-logo.png" alt="" />
        )}
      </button>
    </Link>
  );
};

export default Logo;
