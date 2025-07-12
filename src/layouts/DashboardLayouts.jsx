import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import NotificationPopup from "../components/shared/Notifications/Notifications";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import { useUserRole } from "../hooks/useUserRole";

const DashboardLayouts = () => {
  const [currentUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "buyer", // Change this to "admin", "buyer", or "worker" to test different views
    coins: 1250,
    avatar: "/placeholder.svg?height=40&width=40",
  });

  const { role, roleLoading } = useUserRole();

  const [activeRoute, setActiveRoute] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    const commonItems = [{ name: "Home", icon: "🏠", path: "/dashboard" }];

    const roleSpecificItems = {
      admin: [
        { name: "Manage Users", icon: "👥", path: "/dashboard/manage-users" },
        { name: "Manage Tasks", icon: "⚙️", path: "/dashboard/manage-tasks" },
      ],
      buyer: [
        { name: "Add New Tasks", icon: "➕", path: "/dashboard/add-new-task" },
        { name: "My Tasks", icon: "📊", path: "/dashboard/my-tasks" },
        {
          name: "Purchase Coins",
          icon: "🪙",
          path: "/dashboard/purchase-coins",
        },
        {
          name: "Payment History",
          icon: "💳",
          path: "/dashboard/payment-records",
        },
      ],
      worker: [
        { name: "Task List", icon: "📋", path: "/dashboard/task-list" },
        {
          name: "My Submissions",
          icon: "📝",
          path: "/dashboard/my-submissions",
        },
        { name: "Withdrawals", icon: "💰", path: "/dashboard/withdrawals" },
      ],
    };

    return [...commonItems, ...roleSpecificItems[role]];
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

  const handleToggleNotificationPopup = () => {};

  if (roleLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        style={{ height: "100vh" }} // Ensures sidebar is always full height
      >
        <Link to="/">
          <div className="flex items-center justify-center h-17 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Worklix
              </span>
            </div>
          </div>
        </Link>

        <nav className="mt-8 px-4 space-y-2">
          {getNavigationItems().map((item) => (
            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              to={item.path}
              end
              key={item.name}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="bg-white z-50 sticky top-0 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
              <NotificationPopup />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-inner">
          <div className="container mx-auto px-4 py-2">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Worklix. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayouts;
