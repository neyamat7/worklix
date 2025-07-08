import { useState } from "react";

const DashboardLayouts = () => {
  const [currentUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "worker", // Change this to "admin", "buyer", or "worker" to test different views
    coins: 1250,
    avatar: "/placeholder.svg?height=40&width=40",
  });

  const [activeRoute, setActiveRoute] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const [users] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "buyer",
      coins: 1250,
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "worker",
      coins: 800,
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "worker",
      coins: 600,
      avatar: "/placeholder.svg",
    },
  ]);

  // Navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [
      { name: "Home", icon: "🏠" },
      { name: "Task List", icon: "📋" },
      { name: "My Submissions", icon: "📝" },
      { name: "Withdrawals", icon: "💰" },
    ];

    const roleSpecificItems = {
      admin: [
        { name: "Manage Users", icon: "👥" },
        { name: "Manage Tasks", icon: "⚙️" },
        { name: "Payment History", icon: "💳" },
      ],
      buyer: [
        { name: "Add New Tasks", icon: "➕" },
        { name: "My Tasks", icon: "📊" },
        { name: "Purchase Coins", icon: "🪙" },
      ],
      worker: [
        { name: "Purchase Coins", icon: "🪙" },
        { name: "Payment History", icon: "💳" },
      ],
    };

    return [...commonItems, ...roleSpecificItems[currentUser.role]];
  };

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

  // Stats calculations
  const getStats = () => {
    if (currentUser.role === "admin") {
      return {
        totalWorkers: users.filter((u) => u.role === "worker").length,
        totalBuyers: users.filter((u) => u.role === "buyer").length,
        totalCoins: users.reduce((sum, u) => sum + u.coins, 0),
        totalPayments: 5420, // dummy data
      };
    } else if (currentUser.role === "buyer") {
      const userTasks = tasks.filter((t) => t.buyer_id === currentUser.id);
      return {
        totalTasks: userTasks.length,
        pendingTasks: userTasks.reduce((sum, t) => sum + t.required_workers, 0),
        totalPayments: 1200, // dummy data
      };
    } else {
      const workerSubmissions = submissions.filter(
        (s) => s.worker_id === currentUser.id
      );
      return {
        totalSubmissions: workerSubmissions.length,
        pendingSubmissions: workerSubmissions.filter(
          (s) => s.status === "pending"
        ).length,
        totalEarnings: workerSubmissions
          .filter((s) => s.status === "approved")
          .reduce((sum, s) => sum + s.payable_amount, 0),
      };
    }
  };

  const stats = getStats();

  // Render different home content based on role
  const renderHomeContent = () => {
    if (currentUser.role === "admin") {
      return (
        <div className="space-y-6">
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Workers
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalWorkers}
                  </p>
                </div>
                <div className="text-3xl">👷</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Buyers
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBuyers}
                  </p>
                </div>
                <div className="text-3xl">🛒</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Coins
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalCoins}
                  </p>
                </div>
                <div className="text-3xl">🪙</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Payments
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalPayments}
                  </p>
                </div>
                <div className="text-3xl">💳</div>
              </div>
            </div>
          </div>

          {/* Withdrawal Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Withdrawal Requests
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {withdrawalRequests
                    .filter((req) => req.status === "pending")
                    .map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {request.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${request.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {request.requested_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleWithdrawalApproval(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Payment Success
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (currentUser.role === "buyer") {
      return (
        <div className="space-y-6">
          {/* Buyer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalTasks}
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
                    {stats.pendingTasks}
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
                    ${stats.totalPayments}
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
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setIsModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleApproveSubmission(submission.id)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleRejectSubmission(submission.id)
                            }
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
      );
    } else {
      // Worker view
      return (
        <div className="space-y-6">
          {/* Worker Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Submissions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalSubmissions}
                  </p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Submissions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingSubmissions}
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalEarnings}
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>

          {/* Approved Submissions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Approved Submissions
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Task Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Buyer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {submissions
                    .filter(
                      (sub) =>
                        sub.status === "approved" &&
                        sub.worker_id === currentUser.id
                    )
                    .map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {submission.task_title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${submission.payable_amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {submission.buyer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                            {submission.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white min-h-screen dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-17 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Worklix
            </span>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {getNavigationItems().map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveRoute(item.name);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                activeRoute === item.name
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeRoute}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Available Coins */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  🪙 {currentUser.coins}
                </span>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25a.75.75 0 0 0 .75.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 0 .75-.75V9.75a6 6 0 0 1 6-6z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {activeRoute === "Home" ? (
            renderHomeContent()
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {activeRoute}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This is the {activeRoute} page content. Implementation coming
                soon...
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Submission Detail Modal */}
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
    </div>
  );
};

export default DashboardLayouts;
