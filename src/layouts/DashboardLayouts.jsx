import { useEffect, useState } from "react";
import { FaMotorcycle, FaUserClock, FaUserShield } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import {
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link, NavLink, Outlet } from "react-router";
import { useUserRole } from "../hooks/useUserRole";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, roleLoading } = useUserRole();
  // console.log(role);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 768 &&
        sidebarOpen &&
        !event.target.closest(".sidebar")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed md:relative z-40 w-64 h-full bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out dark:bg-gray-900`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/">
            <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              ParcelTrack
            </h1>
          </Link>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Delivery Dashboard
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                      : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiHome className="h-5 w-5 mr-3" />
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/my-parcels"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                      : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiPackage className="h-5 w-5 mr-3" />
                My Parcels
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/payment-history"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                      : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiCreditCard className="h-5 w-5 mr-3" />
                Payment History
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/track-parcel"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                      : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiMapPin className="h-5 w-5 mr-3" />
                Track a Parcel
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/update-profile"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                      : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiUser className="h-5 w-5 mr-3" />
                Update Profile
              </NavLink>
            </li>

            {/* rider route */}
            {!roleLoading && role === "rider" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/pending-deliveries"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FiPackage className="h-5 w-5 mr-3" />
                    Pending Deliveries
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/completed-deliveries"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FiCheckCircle className="h-5 w-5 mr-3 text-green-500" />
                    Completed Deliveries
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/my-earnings"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FiDollarSign className="h-5 w-5 mr-3" />
                    My Earnings
                  </NavLink>
                </li>
              </>
            )}

            {!roleLoading && role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/assign-rider"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaMotorcycle className="h-5 w-5 mr-3" />
                    Assign Rider
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/active-riders"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUserCheck className="h-5 w-5 mr-3" />
                    Active Riders
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/pending-riders"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUserClock className="h-5 w-5 mr-3" />
                    Pending Riders
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/make-admin"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-indigo-400 dark:bg-indigo-600 dark:text-white"
                          : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUserShield className="h-5 w-5 mr-3" />
                    Make Admin
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
            My Parcels
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your parcels
          </p>
        </div>

        {/* Parcel cards */}
        <div className="grid grid-cols-1 gap-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
