import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useDeleteTaskByAdmin } from "../../../../hooks/useDeleteTaskByAdmin";

const ManageTasks = () => {
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const axiosSecure = useAxiosSecure();
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/all-tasks");
      return res.data; // array of tasks
    },
  });

  // delete task mutation
  const deleteTaskMutation = useDeleteTaskByAdmin();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError.message}</div>;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === "" ||
      task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.buyer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteTask = async (task) => {
    await Swal.fire({
      title: "Delete Task?",
      html: `
      <div class="text-left">
        <div class="flex items-center space-x-3 mb-4">
          <img src="${
            task.task_image_url || "/placeholder.svg"
          }" alt="Task" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h4 class="font-semibold text-gray-900">${task.task_title}</h4>
            <p class="text-sm text-gray-600">by ${task.buyer_name}</p>
          </div>
        </div>
        <p class="text-gray-700 mb-2">This action cannot be undone. The task and all associated data will be permanently deleted.</p>
        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-800 text-sm font-medium">⚠️ This will affect ${
            task.required_workers
          } workers and ${
        task.total_payable_amount
      } coins in total payments.</p>
        </div>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete Task",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-bold",
        htmlContainer: "text-left",
        confirmButton: "rounded-xl px-6 py-3 font-semibold",
        cancelButton: "rounded-xl px-6 py-3 font-semibold",
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          deleteTaskMutation.mutate(task._id, {
            onSuccess: (data) => {
              setTimeout(() => {
                resolve();
                Swal.fire({
                  title: "Deleted!",
                  text: data?.message || "The task has been deleted.",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                });
              }, 300); // optional small delay to look smoother
            },
            onError: (error) => {
              reject(
                error?.response?.data?.message ||
                  "Something went wrong while deleting."
              );
            },
          });
        });
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FiClock className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case "expired":
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FiAlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1";
    switch (status) {
      case "active":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "expired":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  const getProgressPercentage = (task) => {
    if (task.total_workers === 0) return 0;
    return Math.round(
      ((task.total_workers - task.required_workers) / task.total_workers) * 100
    );
  };

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => t.status === "active").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const expiredTasks = tasks.filter((t) => t.status === "expired").length;
  const totalBudget = tasks.reduce((sum, t) => sum + t.total_payable_amount, 0);

  return (
    <div>
      <div className="h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="relative z-10 h-[calc(100vh-105px)] p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 pt-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Manage Tasks
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Monitor and manage all platform tasks with comprehensive
                  controls
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Tasks
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {totalTasks}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FiGrid className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Tasks
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {activeTasks}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {completedTasks}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Expired
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {expiredTasks}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FiXCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Budget
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tasks by title or buyer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full sm:w-80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-12 pr-10 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200 appearance-none min-w-[150px]"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "table"
                          ? "bg-white dark:bg-gray-600 shadow-lg text-indigo-600 dark:text-indigo-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <FiList className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "cards"
                          ? "bg-white dark:bg-gray-600 shadow-lg text-indigo-600 dark:text-indigo-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
                    {filteredTasks.length} tasks
                  </div>
                </div>
              </div>
            </div>
            {filteredTasks.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center">
                <FiGrid className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No tasks found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No tasks available in the system"}
                </p>
              </div>
            ) : viewMode === "table" ? (
              <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Buyer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      {filteredTasks.map((task, index) => (
                        <tr
                          key={task._id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={task.task_image_url || "/placeholder.svg"}
                                alt={task.task_title}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-white dark:border-gray-600 shadow-lg"
                              />
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                                  {task.task_title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {task._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <FiUser className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {task.buyer_name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.buyer_email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={getStatusBadge(task.status)}>
                              {getStatusIcon(task.status)}
                              <span className="capitalize">{task.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {task.total_workers - task.required_workers}/
                                  {task.total_workers}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {getProgressPercentage(task)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getProgressPercentage(task)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="font-bold text-gray-900 dark:text-white">
                                ${task.total_payable_amount}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ${task.payable_amount} per worker
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <FiCalendar className="w-4 h-4" />
                              <span>{formatDate(task.completion_date)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteTask(task)}
                              className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task, index) => (
                  <div
                    key={task._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={task.task_image_url || "/placeholder.svg"}
                          alt={task.task_title}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-600 shadow-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                            {task.task_title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {task.buyer_name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mb-4">
                      <span className={getStatusBadge(task.status)}>
                        {getStatusIcon(task.status)}
                        <span className="capitalize">{task.status}</span>
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {task.total_workers - task.required_workers}/
                          {task.total_workers} workers
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(task)}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getProgressPercentage(task)}% complete
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiDollarSign className="w-4 h-4" />
                          <span>Budget</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">
                            ${task.total_payable_amount}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ${task.payable_amount} per worker
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiUsers className="w-4 h-4" />
                          <span>Workers</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.total_workers} total
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
                      <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Task ID: {task._id.slice(-12)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {viewMode === "table" && (
              <div className="lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task._id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={task.task_image_url || "/placeholder.svg"}
                            alt={task.task_title}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-600 shadow-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                              {task.task_title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {task.buyer_name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task)}
                          className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mb-4">
                        <span className={getStatusBadge(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="capitalize">{task.status}</span>
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {task.total_workers - task.required_workers}/
                            {task.total_workers} workers
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(task)}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getProgressPercentage(task)}% complete
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiDollarSign className="w-4 h-4" />
                            <span>Budget</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              ${task.total_payable_amount}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ${task.payable_amount} per worker
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiUsers className="w-4 h-4" />
                            <span>Workers</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.total_workers} total
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
                        <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Task ID: {task._id.slice(-12)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;
