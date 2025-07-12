import { useQuery } from "@tanstack/react-query";
import {
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCoins,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { useApproveWithdrawal } from "../../../../hooks/useApproveWithdrawal";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { usePendingWithdrawals } from "../../../../hooks/usePendingWithdrawals";
import { useAllUsers } from "../../../../hooks/useUserData";

export default function AdminHome() {
  const axiosSecure = useAxiosSecure();

  const { data: users, isLoading: usersLoading } = useAllUsers();

  const { data: withdrawalRequests, isLoading: withdrawalsLoading } =
    usePendingWithdrawals();
  const approveWithdrawalMutation = useApproveWithdrawal();

  const { data: totalPayments, isLoading } = useQuery({
    queryKey: ["total-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/total-payments");
      return res.data;
    },
  });

  if (isLoading || usersLoading || withdrawalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  // Calculate stats
  const totalWorkers = users.filter((user) => user.role === "worker").length;
  const totalBuyers = users.filter((user) => user.role === "buyer").length;
  const totalAvailableCoins = users.reduce((sum, user) => sum + user.coins, 0);

  const handlePaymentSuccess = (withdrawalId) => {
    approveWithdrawalMutation.mutate(withdrawalId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentSystemColor = (system) => {
    const colors = {
      bkash: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      rocket: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      nagad: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      bank: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      paypal: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    };
    return colors[system] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl">
            <FaUserTie className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
            Monitor platform statistics, manage users, and oversee withdrawal
            requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Workers */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-400 text-sm font-medium mb-1">
                  Total Workers
                </p>
                <p className="text-3xl font-bold text-white dark:text-gray-100">
                  {totalWorkers}
                </p>
                <p className="text-green-400 text-xs mt-1 flex items-center">
                  <FaChartLine className="w-3 h-3 mr-1" />
                  Active users
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <FaUsers className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Total Buyers */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-400 text-sm font-medium mb-1">
                  Total Buyers
                </p>
                <p className="text-3xl font-bold text-white dark:text-gray-100">
                  {totalBuyers}
                </p>
                <p className="text-purple-400 text-xs mt-1 flex items-center">
                  <FaChartLine className="w-3 h-3 mr-1" />
                  Active clients
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <FaShoppingCart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Total Available Coins */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-400 text-sm font-medium mb-1">
                  Available Coins
                </p>
                <p className="text-3xl font-bold text-white dark:text-gray-100">
                  {totalAvailableCoins.toLocaleString()}
                </p>
                <p className="text-yellow-400 text-xs mt-1 flex items-center">
                  <FaChartLine className="w-3 h-3 mr-1" />
                  Platform balance
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <FaCoins className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Total Payments */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-400 text-sm font-medium mb-1">
                  Total Payments
                </p>
                <p className="text-3xl font-bold text-white dark:text-gray-100">
                  ${totalPayments.toLocaleString()}
                </p>
                <p className="text-green-400 text-xs mt-1 flex items-center">
                  <FaChartLine className="w-3 h-3 mr-1" />
                  Revenue generated
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <FaDollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Requests */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl">
          <div className="p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-2">
                  Pending Withdrawal Requests
                </h2>
                <p className="text-gray-300 dark:text-gray-400">
                  Review and approve withdrawal requests from workers
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-lg border border-orange-500/30">
                <FaClock className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 font-medium">
                  {
                    withdrawalRequests.filter((req) => req.status === "pending")
                      .length
                  }{" "}
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Worker
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-white/5">
                {withdrawalRequests
                  .filter((request) => request.status === "pending")
                  .map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-white/5 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-white dark:text-gray-100 font-medium">
                            {request.worker_name}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {request.worker_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCoins className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-white dark:text-gray-100 font-medium">
                            {request.withdrawal_coin}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaDollarSign className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-white dark:text-gray-100 font-medium">
                            ${request.withdrawal_amount.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentSystemColor(
                            request.payment_system
                          )}`}
                        >
                          {request.payment_system.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 dark:text-gray-400 font-mono text-sm">
                        {request.account_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 dark:text-gray-400 text-sm">
                        {formatDate(request.withdraw_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePaymentSuccess(request._id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                          <span>Payment Success</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-6 space-y-4">
            {withdrawalRequests
              .filter((request) => request.status === "pending")
              .map((request) => (
                <div
                  key={request._id}
                  className="bg-white/5 dark:bg-white/5 rounded-xl p-4 border border-white/10 dark:border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white dark:text-gray-100 font-medium">
                        {request.worker_name}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">
                        {request.worker_email}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentSystemColor(
                        request.payment_system
                      )}`}
                    >
                      {request.payment_system.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                        Coins
                      </p>
                      <div className="flex items-center">
                        <FaCoins className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-white dark:text-gray-100 font-medium">
                          {request.withdrawal_coin}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                        Amount
                      </p>
                      <div className="flex items-center">
                        <FaDollarSign className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-white dark:text-gray-100 font-medium">
                          ${request.withdrawal_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                      Account Number
                    </p>
                    <p className="text-gray-300 dark:text-gray-400 font-mono text-sm">
                      {request.account_number}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                      Request Date
                    </p>
                    <p className="text-gray-300 dark:text-gray-400 text-sm">
                      {formatDate(request.withdraw_date)}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePaymentSuccess(request._id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    <span>Payment Success</span>
                  </button>
                </div>
              ))}
          </div>

          {withdrawalRequests.filter((req) => req.status === "pending")
            .length === 0 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-300 dark:text-gray-400 mb-2">
                No Pending Requests
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                All withdrawal requests have been processed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
