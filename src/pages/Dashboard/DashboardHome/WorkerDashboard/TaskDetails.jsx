import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useHasSubmitted } from "../../../../hooks/useHasSubmitted";

const TaskDetails = () => {
  const queryClient = useQueryClient();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const { taskId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    data: task,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["task", taskId],
    enabled: !!taskId, // Only fetch if id exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/worker/task/${taskId}`);
      return res.data;
    },
  });

  const { data } = useHasSubmitted(user?.email, task?._id);
  const alreadySubmitted = data?.alreadySubmitted;

  const mutation = useMutation({
    mutationFn: async (submissionData) => {
      const res = await axiosSecure.post("/submissions", submissionData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Your task has been submitted successfully.",
        icon: "success",
        timer: 3400, // Auto-close after 2.5 seconds
        showConfirmButton: false,
        background: "#f8fafc",
        position: "center",
        toast: true,
        width: "400px",
        customClass: {
          title: "text-lg font-semibold text-gray-900",
          popup: "shadow-lg border border-gray-200",
        },
      });
      refetch();
      queryClient.invalidateQueries(["submissions"]);
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Submission error:", error);
    },
    onSettled: () => {
      setShowSubmissionModal(false);
    },
  });

  const handleClickSubmitTask = () => {
    if (alreadySubmitted) {
      Swal.fire({
        title: "Already Submitted",
        text: "You have already submitted this task.",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6", // blue-500
        background: "#ffffff",
        backdrop: `
      rgba(0,0,0,0.4)
      url("/images/nyan-cat.gif")
      left top
      no-repeat
    `,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return;
    }
    setShowSubmissionModal(true);
  };

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
                      {task.payable_amount} coins
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
                      {task.total_payable_amount} coins
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
                      onClick={handleClickSubmitTask}
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
        {showSubmissionModal && (
          <SubmissionModal
            task={task}
            onClose={() => setShowSubmissionModal(false)}
            worker={user}
            mutation={mutation}
          />
        )}
      </div>
    </div>
  );
};

export default TaskDetails;

const SubmissionModal = ({ task, onClose, worker, mutation }) => {
  const [submissionDetails, setSubmissionDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionDetails.trim()) return;

    const finalSubmission = {
      task_id: task._id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      submission_details: submissionDetails,
      worker_email: worker?.email,
      worker_name: worker?.displayName,
      buyer_email: task.buyer_email,
      buyer_name: task.buyer_name,
      submission_date: new Date().toISOString(),
      status: "pending",
    };
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    mutation.mutate(finalSubmission);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Submit Task
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Task Summary */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Task Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Title:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {task.task_title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Buyer:</span>
              <span className="text-gray-900 dark:text-white">
                {task.buyer_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment:</span>
              <span className="text-green-600 dark:text-green-400 font-bold">
                ${task.payable_amount}
              </span>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Submission Details *
            </label>
            <textarea
              value={submissionDetails}
              onChange={(e) => setSubmissionDetails(e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
              placeholder="Describe your submission, provide links, or explain how you completed the task..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !submissionDetails.trim()}
              className={`flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2 ${
                mutation.isPending || !submissionDetails.trim()
                  ? "opacity-50 cursor-not-allowed transform-none"
                  : ""
              }`}
            >
              {mutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
