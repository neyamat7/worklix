import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiCalendar,
  FiClipboard,
  FiDollarSign,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Loading from "../../../../components/shared/Loading/Loading";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useBuyerTasks } from "../../../../hooks/useBuyerTasks";
import TaskEditModal from "./TaskEditModal";
import TaskModal from "./TaskModal";

const MyTask = () => {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useSelector((state) => state.auth);
  const [editTask, setEditTask] = useState();

  // Fetch tasks using TanStack Query
  const { data: tasks = [], isLoading } = useBuyerTasks(user?.email);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (taskId) => axiosSecure.delete(`/buyer/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire({
        title: "Deleted!",
        text: "Your task has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
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
    }
  };

  const { mutate: updateTask, isPending: isUpdating } = useMutation({
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
    return <Loading />;
  }

  return (
    <div className="h-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto">
        {tasks?.length > 0 && (
          <div className="mb-7">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Manage Your Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The more details you add, the higher-quality proposals you’ll
              receive.
            </p>
          </div>
        )}

        {tasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-5 p-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
              <FiClipboard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm">
              Tasks you add will show up here. Tap the "+" button to begin.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
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
                        Required Workers
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

            <div className="sm:hidden space-y-4">
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
                        <span>{task.required_workers} Required</span>
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
          </>
        )}

        {/* Mobile Card View */}

        {/* Task Details Modal */}
        {isModalOpen && selectedTask && (
          <TaskModal
            selectedTask={selectedTask}
            setIsModalOpen={setIsModalOpen}
          />
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
