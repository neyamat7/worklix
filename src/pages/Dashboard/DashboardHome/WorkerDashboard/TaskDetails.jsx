import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const TaskDetails = () => {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const { taskId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    enabled: !!taskId, // Only fetch if id exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/worker/task/${taskId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg text-gray-700 dark:text-gray-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Back to Tasks</span>
              </button>

              <div className="flex items-center space-x-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    task.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            {/* Task Details */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Task Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={task.task_image_url || "/placeholder.svg"}
                  alt={task.task_title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {task.task_title}
                  </h1>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-1">
                      <FiUser className="w-4 h-4" />
                      <span>{task.buyer_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>
                        {new Date(task.completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${task.payable_amount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Payment per worker
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {task.required_workers}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Workers needed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${task.total_payable_amount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total budget
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {task.total_paid_workers}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Completed
                    </div>
                  </div>
                </div>

                {/* Task Information */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Task Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {task.task_detail}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Submission Requirements
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {task.submission_info}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Buyer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Name:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {task.buyer_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Email:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {task.buyer_email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Task Timeline
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Created:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(task.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Deadline:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(
                              task.completion_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Task Button */}
                  <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                      onClick={() => setShowSubmissionModal(true)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg text-lg"
                    >
                      Submit Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Modal */}
        
      </div>
    </div>
  );
};

export default TaskDetails;

 