import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import Loading from "../components/shared/Loading/Loading";
import Logo from "../components/shared/Logo/Logo";
import NotificationPopup from "../components/shared/Notifications/Notifications";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import useAuth from "../context/AuthContext";
import { useSingleUserData } from "../hooks/useUserData";
import { useUserRole } from "../hooks/useUserRole";

const DashboardLayouts = () => {
  const { role, roleLoading } = useUserRole();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user: authUser } = useAuth();
  const { data: userData, isLoading: userLoading } = useSingleUserData(
    authUser?.email
  );

  if (userLoading || roleLoading) {
    return <Loading />;
  }

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

    return [...commonItems, ...roleSpecificItems[role || "worker"]];
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-gray-800 shadow-lg transform border-r border-r-gray-100 dark:border-r-gray-700 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        style={{ height: "100vh" }}
      >
        <div className="px-4 -mt-3 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <Logo />
        </div>

        <nav className="px-4 space-y-2 mt-1">
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
        <header className="bg-white w-full mx-auto z-50 sticky top-0 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 pt-5 py-4">
            <div className="flex items-center space-x-0">
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
              <Link
                to="/"
                className="text-xl font-semibold bg-gradient-to-tr from-blue-600 to-purple-600 bg-clip-text text-transparent lg:hidden"
              >
                Worklix
              </Link>
            </div>

            <div className="flex items-center">
              {/* Available Coins */}
              <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg mr-2">
                <span className="text-sm font-medium">
                  Coins: {userData?.coins}
                </span>
              </div>

              {/* User Info */}
              <div className="flex items-center md:mr-2">
                <img
                  src={authUser?.photoURL || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-2"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {authUser?.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {userData?.role}
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

        <footer className="bg-gray-100 dark:bg-gray-800 shadow-inner shadow-gray-200 dark:shadow-gray-700 py-4">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <p className="text-center text-sm text-gray-700 dark:text-gray-400">
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
