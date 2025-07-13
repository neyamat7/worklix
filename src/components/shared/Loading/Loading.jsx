import { FiLoader } from "react-icons/fi";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <FiLoader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading....</p>
      </div>
    </div>
  );
};

export default Loading;
