// pages/Unauthorized.jsx
import { useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-900 p-4">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">
        Unauthorized Access
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        You do not have permission to view this page.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
