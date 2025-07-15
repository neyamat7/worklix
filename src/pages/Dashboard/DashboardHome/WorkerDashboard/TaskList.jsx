import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiEye,
  FiGrid,
  FiSearch,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router";
import ErrorMessage from "../../../../components/shared/ErrorMessage/ErrorMessage";
import Loading from "../../../../components/shared/Loading/Loading";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activeTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/worker/tasks-list");
      console.log(res);
      return res.data;
    },
  });
  console.log(tasks);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === "" ||
      task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.buyer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "completed":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
      case "expired":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="relative max-w-6xl mx-auto w-full z-10 h-full p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Available Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and complete tasks to earn coins
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FiGrid className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter((t) => t.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${tasks.reduce((sum, t) => sum + t.payable_amount, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks or buyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Task Cards */}
          {filteredTasks.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center">
              <FiGrid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No tasks available at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* Task Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={task.task_image_url || "/placeholder.svg"}
                      alt={task.task_title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={getStatusBadge(task.status)}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {task.task_title}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiUser className="w-4 h-4" />
                          <span>Buyer</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.buyer_name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          <span>Deadline</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(task.completion_date)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FaCoins className="w-4 h-4" />
                          <span>Payment</span>
                        </div>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {task.payable_amount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiUsers className="w-4 h-4" />
                          <span>Required Workers</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.required_workers}
                        </span>
                      </div>
                    </div>

                    <Link to={`/dashboard/task-details/${task._id}`}>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2">
                        <FiEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
