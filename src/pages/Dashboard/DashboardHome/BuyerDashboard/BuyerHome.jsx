import { useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiEye,
  FiFileText,
  FiGrid,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useApproveSubmission } from "../../../../hooks/useApproveSubmission";
import { usePendingSubmissions } from "../../../../hooks/useBuyerPendingSubmissions";
import { useBuyerTasks } from "../../../../hooks/useBuyerTasks";
import { useRejectSubmission } from "../../../../hooks/useRejectSubmission";

const BuyerHome = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  // Fetch buyer tasks using custom hook
  const { data: buyerTasks, isLoading } = useBuyerTasks(user?.email);
  const approveSubmission = useApproveSubmission();
  const rejectSubmission = useRejectSubmission();

  // Fetch pending submissions using custom hook
  const {
    data: pendingSubmissions,
    isLoading: isLoadingSubmissons,
    error,
  } = usePendingSubmissions(user?.email);

  if (isLoading || isLoadingSubmissons) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  // Calculate stats
  const totalTasks = buyerTasks.length;
  const pendingTasksCount = buyerTasks.reduce(
    (sum, task) => sum + task.required_workers,
    0
  );
  const totalPaymentPaid = buyerTasks.reduce(
    (sum, task) => sum + task.total_paid_amount,
    0
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleApproveSubmission = (submission) => {
    const { _id, worker_email, payable_amount } = submission;

    approveSubmission.mutate({
      submissionId: _id,
      worker_email,
      payable_amount,
      task_id: submission.task_id,
      buyer_email: submission.buyer_email,
    });
  };

  const handleRejectSubmission = (submission) => {
    Swal.fire({
      title: "Reject Submission?",
      html: `
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
        <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <p class="text-gray-700">Are you sure you want to reject this submission?</p>
    </div>
  `,
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444", // Tailwind red-500
      cancelButtonColor: "#E5E7EB", // Tailwind gray-200
      background: "#f9fafb", // Tailwind gray-50
      width: "28rem",
      customClass: {
        confirmButton: "px-4 py-2 rounded-md font-medium",
        cancelButton: "px-4 py-2 rounded-md font-medium text-gray-700",
        popup: "rounded-lg shadow-xl",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        rejectSubmission.mutate({
          submissionId: submission._id,
          task_id: submission.task_id,
          buyer_name: submission.buyer_name,
          worker_email: submission.worker_email,
          task_title: submission.task_title,
        });
      }
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative z-10 h-full p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Buyer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.displayName}! Manage your tasks and review
                submissions.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalTasks}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Tasks you've created
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FiGrid className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pendingTasksCount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Workers still needed
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Payment Paid
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${totalPaymentPaid}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Amount paid to workers
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FiGrid className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Add New Task
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Create a new task
                  </p>
                </div>
              </div>
            </button>

            <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    My Tasks
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    View all your tasks
                  </p>
                </div>
              </div>
            </button>

            <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Purchase Coins
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Buy more coins
                  </p>
                </div>
              </div>
            </button>

            <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Analytics
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    View performance
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Tasks to Review Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tasks to Review
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Review and approve pending submissions from workers
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full">
                  <FiClock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {pendingSubmissions.length} Pending
                  </span>
                </div>
              </div>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <FiCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  All caught up!
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  No pending submissions to review at the moment.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80 dark:bg-gray-700/80">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Worker Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Task Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Payment Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      {pendingSubmissions.map((submission) => (
                        <tr
                          key={submission._id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <FiUser className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {submission.worker_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                              {submission.task_title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                              ${submission.payable_amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {formatDate(submission.submission_date)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewSubmission(submission)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <FiEye className="w-3 h-3" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleApproveSubmission(submission)
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <FiCheck className="w-3 h-3" />
                                <span>
                                  {approveSubmission.isPending
                                    ? "Approving..."
                                    : "Approve"}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectSubmission(submission)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <FiX className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-4">
                  {pendingSubmissions.map((submission) => (
                    <div
                      key={submission._id}
                      className="bg-gray-50/80 dark:bg-gray-700/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {submission.worker_name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {submission.task_title}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${submission.payable_amount}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Submitted {formatDate(submission.submission_date)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleViewSubmission(submission)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiEye className="w-4 h-4" />
                          <span>View Submission</span>
                        </button>
                        <button
                          onClick={() => handleApproveSubmission(submission)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>
                            {approveSubmission.isPending
                              ? "Approving..."
                              : "Approve"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleRejectSubmission(submission)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Submission Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Task Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Task Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Task Title:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {selectedSubmission.task_title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Worker:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedSubmission.worker_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Payment:
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      ${selectedSubmission.payable_amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Submitted:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(selectedSubmission.submission_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Details */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Submission Details
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedSubmission.submission_details}
                  </p>
                </div>
              </div>

              {/* Worker Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Worker Information
                </h4>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {selectedSubmission.worker_name}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedSubmission.worker_email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  handleRejectSubmission(selectedSubmission);
                  setIsModalOpen(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Reject Submission</span>
              </button>
              <button
                onClick={() => {
                  handleApproveSubmission(selectedSubmission);
                  setIsModalOpen(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FiCheck className="w-4 h-4" />
                <span>
                  {" "}
                  {approveSubmission.isPending
                    ? "Approving..."
                    : "Approve Submission"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
