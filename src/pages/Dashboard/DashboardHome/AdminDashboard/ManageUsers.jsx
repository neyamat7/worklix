import { useState } from "react";
import {
  FiAlertTriangle,
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiTool,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useDeleteUser } from "../../../../hooks/useDeleteUser";
import { useUpdateUserRole } from "../../../../hooks/useUpdateUserRole";
import { useAllUsers } from "../../../../hooks/useUserData";

const ManageUsers = () => {
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data: users, isLoading, error } = useAllUsers();
  const updateRoleMuation = useUpdateUserRole();

  // delete user mutation
  const deleteUserMutation = useDeleteUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId, newRole) => {
    // update user role using mutation
    updateRoleMuation.mutate({ userId, newRole });
    // In real app, this would call your API
    console.log(`Updated user ${userId} role to ${newRole}`);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete._id, {
        onSettled: () => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        },
      });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FiShield className="w-4 h-4 text-red-500" />;
      case "buyer":
        return <FiShoppingBag className="w-4 h-4 text-blue-500" />;
      case "worker":
        return <FiTool className="w-4 h-4 text-green-500" />;
      default:
        return <FiUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1";
    switch (role) {
      case "admin":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-white`;
      case "buyer":
        return `${baseClasses} bg-red-100 text-orange-500 dark:bg-orange-900/70 dark:text-white`;
      case "worker":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-white`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/70 dark:text-gray-400`;
    }
  };

  const getRoleGradient = (role) => {
    switch (role) {
      case "admin":
        return "from-blue-500 to-purple-500";
      case "buyer":
        return "from-red-500 to-pink-500";
      case "worker":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const buyerCount = users.filter((u) => u.role === "buyer").length;
  const workerCount = users.filter((u) => u.role === "worker").length;
  const totalCoins = users.reduce((sum, u) => sum + u.coins, 0);

  return (
    <div>
      <div className="min-h-[calc(100vh-105px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="relative z-10 h-full p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pt-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Manage Users
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Oversee and manage all platform users with advanced controls
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {totalUsers}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Admins
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {adminCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FiShield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Buyers
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {buyerCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FiShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Workers
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {workerCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FiTool className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Coins
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {totalCoins.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🪙</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full sm:w-80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    />
                  </div>

                  {/* Role Filter */}
                  <div className="relative">
                    <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="pl-12 pr-10 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200 appearance-none min-w-[150px]"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="buyer">Buyer</option>
                      <option value="worker">Worker</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "table"
                          ? "bg-white dark:bg-gray-600 shadow-lg text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <FiList className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "cards"
                          ? "bg-white dark:bg-gray-600 shadow-lg text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
                    {filteredUsers.length} users
                  </div>
                </div>
              </div>
            </div>

            {/* Users Data */}
            {filteredUsers.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center">
                <FiUsers className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {searchTerm || roleFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No users available in the system"}
                </p>
              </div>
            ) : viewMode === "table" ? (
              /* Table View - Hidden on small screens */
              <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Coins
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      {filteredUsers.map((user, index) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <img
                                  src={user.photoURL || "/placeholder.svg"}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-lg"
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${getRoleGradient(
                                    user.role
                                  )} rounded-full border-2 border-white dark:border-gray-800`}
                                ></div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {user._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value)
                              }
                              className={`${getRoleBadge(
                                user.role
                              )} border-0 bg-transparent cursor-pointer hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 rounded-full`}
                            >
                              <option value="admin">Admin</option>
                              <option value="buyer">Buyer</option>
                              <option value="worker">Worker</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🪙</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {user.coins.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Card View - Always visible, responsive */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={user.photoURL || "/placeholder.svg"}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-gray-600 shadow-lg"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r ${getRoleGradient(
                              user.role
                            )} rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center`}
                          >
                            {getRoleIcon(user.role)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Role
                        </span>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className={`${getRoleBadge(
                            user.role
                          )} border-0 bg-transparent cursor-pointer hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 rounded-full text-xs`}
                        >
                          <option value="admin">Admin</option>
                          <option value="buyer">Buyer</option>
                          <option value="worker">Worker</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Coins
                        </span>
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-3 py-1 rounded-full">
                          <span className="text-lg">🪙</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {user.coins.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          User ID: {user._id.slice(-12)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show card view on large screens when table is selected but force cards on mobile */}
            {viewMode === "table" && (
              <div className="lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredUsers.map((user, index) => (
                    <div
                      key={user._id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={user.photoURL || "/placeholder.svg"}
                              alt={user.name}
                              className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-gray-600 shadow-lg"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r ${getRoleGradient(
                                user.role
                              )} rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center`}
                            >
                              {getRoleIcon(user.role)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Role
                          </span>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className={`${getRoleBadge(
                              user.role
                            )} border-0 bg-transparent cursor-pointer hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 rounded-full text-xs`}
                          >
                            <option value="admin">Admin</option>
                            <option value="buyer">Buyer</option>
                            <option value="worker">Worker</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Coins
                          </span>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-3 py-1 rounded-full">
                            <span className="text-lg">🪙</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {user.coins.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            User ID: {user._id.slice(-12)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <FiAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete User
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={userToDelete.photoURL || "/placeholder.svg"}
                    alt={userToDelete.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {userToDelete.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userToDelete.email}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete this user? This will
                  permanently remove their account and all associated data.
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FiX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>
                    {deleteUserMutation.isPending
                      ? "Deleting..."
                      : "Delete User"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
