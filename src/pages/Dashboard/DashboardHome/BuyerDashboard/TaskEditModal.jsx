import { useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiDollarSign,
  FiEdit2,
  FiUsers,
  FiX,
} from "react-icons/fi";

const TaskEditModal = ({ task, onClose, onSave, isUpdating }) => {
  const [editedTask, setEditedTask] = useState({
    task_title: task.task_title,
    task_detail: task.task_detail,
    submission_info: task.submission_info,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...task,
      ...editedTask,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            <FiEdit2 className="inline mr-2 text-purple-600" />
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Editable Fields */}
          <div className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title *
              </label>
              <input
                name="task_title"
                value={editedTask.task_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Task Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Details *
              </label>
              <textarea
                name="task_detail"
                value={editedTask.task_detail}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Submission Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Submission Requirements *
              </label>
              <textarea
                name="submission_info"
                value={editedTask.submission_info}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Read-only Fields */}
          <div className="space-y-6">
            {/* Section Title */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Task Information
              </h3>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workers Card */}
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <FiUsers size={18} />
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Workers
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Required
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {task.required_workers}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Completed
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {task.total_paid_workers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <FiDollarSign size={18} />
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Payment
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Per Worker
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${task.payable_amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Total
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${task.total_payable_amount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deadline Card */}
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <FiCalendar size={18} />
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Deadline
                  </h4>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(task.completion_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </p>
              </div>

              {/* Status Card */}
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                    <FiActivity size={18} />
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Status
                  </h4>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isUpdating ? "Uploading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
