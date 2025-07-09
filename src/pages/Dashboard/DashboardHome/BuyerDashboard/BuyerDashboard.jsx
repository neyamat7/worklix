import { useState } from "react";

const BuyerDashboard = () => {
  const [currentUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "buyer", // Change this to "admin", "buyer", or "worker" to test different views
    coins: 1250,
    avatar: "/placeholder.svg?height=40&width=40",
  });

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data
  const [tasks] = useState([
    {
      id: "1",
      title: "Website Design",
      description: "Create a modern website design",
      payable_amount: 500,
      required_workers: 2,
      buyer_id: "1",
      buyer_name: "John Doe",
      status: "active",
    },
    {
      id: "2",
      title: "Logo Creation",
      description: "Design a company logo",
      payable_amount: 200,
      required_workers: 1,
      buyer_id: "1",
      buyer_name: "John Doe",
      status: "active",
    },
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: "1",
      task_id: "1",
      task_title: "Website Design",
      worker_id: "2",
      worker_name: "Alice Smith",
      buyer_name: "John Doe",
      payable_amount: 500,
      status: "pending",
      submission_details:
        "I have completed the website design with modern UI/UX principles...",
      submitted_at: "2024-01-15",
    },
    {
      id: "2",
      task_id: "2",
      task_title: "Logo Creation",
      worker_id: "3",
      worker_name: "Bob Johnson",
      buyer_name: "John Doe",
      payable_amount: 200,
      status: "approved",
      submission_details: "Logo design completed with multiple variations...",
      submitted_at: "2024-01-14",
    },
  ]);

  const [withdrawalRequests, setWithdrawalRequests] = useState([
    {
      id: "1",
      user_id: "2",
      user_name: "Alice Smith",
      amount: 300,
      status: "pending",
      requested_at: "2024-01-15",
    },
    {
      id: "2",
      user_id: "3",
      user_name: "Bob Johnson",
      amount: 150,
      status: "pending",
      requested_at: "2024-01-14",
    },
  ]);

  // Handle submission actions
  const handleApproveSubmission = (submissionId) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, status: "approved" } : sub
      )
    );
    alert("Submission approved! Worker's coins have been increased.");
  };

  const handleRejectSubmission = (submissionId) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, status: "rejected" } : sub
      )
    );
    alert("Submission rejected! Required workers count has been increased.");
  };

  const handleWithdrawalApproval = (withdrawalId) => {
    setWithdrawalRequests((prev) =>
      prev.map((req) =>
        req.id === withdrawalId ? { ...req, status: "approved" } : req
      )
    );
    alert("Withdrawal approved! User's coins have been deducted.");
  };

  const getStats = () => {
    const userTasks = tasks.filter((t) => t.buyer_id === currentUser.id);
    return {
      totalTasks: userTasks.length,
      pendingTasks: userTasks.reduce((sum, t) => sum + t.required_workers, 0),
      totalPayments: 1200, // dummy data
    };
  };

  const stats = getStats();

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Buyer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {/* {stats.totalTasks} */}2
                </p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Tasks
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  3
                </p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Payments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {/* ${stats.totalPayments} */}
                  1200
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Tasks to Review */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks to Review
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Worker Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Task Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {submissions
                  .filter((sub) => sub.status === "pending")
                  .map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {submission.worker_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {submission.task_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${submission.payable_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          // onClick={() => {
                          //   setSelectedSubmission(submission);
                          //   setIsModalOpen(true);
                          // }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                        >
                          View
                        </button>
                        <button
                          // onClick={() => handleApproveSubmission(submission.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                        >
                          Approve
                        </button>
                        <button
                          // onClick={() =>
                          //   handleRejectSubmission(submission.id)
                          // }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Submission Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
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

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedSubmission.task_title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Worker Name
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedSubmission.worker_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payable Amount
                </label>
                <p className="text-gray-900 dark:text-white">
                  ${selectedSubmission.payable_amount}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Submission Details
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {selectedSubmission.submission_details}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Submitted Date
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedSubmission.submitted_at}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  handleRejectSubmission(selectedSubmission.id);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApproveSubmission(selectedSubmission.id);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyerDashboard;
