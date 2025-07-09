import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import TaskEditModal from "./TaskEditModal";

const MyTask = () => {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useSelector((state) => state.auth);
  const [editTask, setEditTask] = useState();

  // Fetch tasks using TanStack Query
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/buyer/tasks", {
        params: { email: user?.email },
      });
      return data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (taskId) => axiosSecure.delete(`/buyer/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Something went wrong.", "error");
    },
  });

  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Red-600
      cancelButtonColor: "#6b7280", // Gray-500
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#f8f8f8",
      customClass: {
        container: "dark:bg-gray-900",
        popup: "bg-white dark:bg-gray-800",
        title: "text-gray-900 dark:text-white",
        text: "text-gray-600 dark:text-gray-300",
        confirmButton: "hover:bg-red-700", // darker on hover
        cancelButton: "hover:bg-gray-200 dark:hover:bg-gray-600",
      },
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(taskId);
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    }
  };

  const { mutate: updateTask, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ taskId, updateData }) => {
      await axiosSecure.patch(`/buyer/tasks/${taskId}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Updated!", "Task updated successfully.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Something went wrong.", "error");
    },
    onSettled: () => {
      setEditTask(null);
    },
  });

  const handleUpdate = (updatedTask) => {
    updateTask({ taskId: updatedTask._id, updateData: updatedTask });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Your Tasks
        </h1>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Task Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                    Total Workers
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Paid Workers
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tasks?.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {task.task_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(task.completion_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center justify-center">
                        <FiUsers className="mr-1" />
                        {task.required_workers}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center justify-center">
                        <FiDollarSign className="mr-1" />
                        {task.total_paid_workers}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setIsModalOpen(true);
                        }}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mr-3"
                      >
                        <FiEye className="inline mr-1" /> View
                      </button>
                      <button
                        onClick={() => setEditTask(task)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                      >
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {tasks?.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {task.task_title}
                    </h3>
                    <div className="flex items-center mt-1 space-x-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar className="mr-1" />
                        <span>{formatDate(task.completion_date)}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between space-x-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiUsers className="mr-1" />
                    <span>{task.required_workers} needed</span>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-full"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => setEditTask(task)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Task Details Modal */}
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {selectedTask.task_title}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                {selectedTask.task_image_url && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedTask.task_image_url}
                      alt="Task"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Task Details
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {selectedTask.task_detail}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Submission Info
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {selectedTask.submission_info}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiUsers className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Workers
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Required
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {selectedTask.required_workers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Completed
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {selectedTask.total_paid_workers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Per Worker
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          ${selectedTask.payable_amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Paid
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          ${selectedTask.total_paid_amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {formatDate(selectedTask.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Deadline
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {formatDate(selectedTask.completion_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {editTask && (
          <TaskEditModal
            task={editTask}
            onClose={() => setEditTask(null)}
            onSave={handleUpdate}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
};

export default MyTask;
