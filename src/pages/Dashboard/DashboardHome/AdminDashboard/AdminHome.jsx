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
import Loading from "../../../../components/shared/Loading/Loading";
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
    return <Loading />;
  }

  // Calculate stats
  const totalWorkers = users.filter((user) => user.role === "worker").length;
  const totalBuyers = users.filter((user) => user.role === "buyer").length;
  const totalAvailableCoins = users.reduce((sum, user) => sum + user.coins, 0);

  const handlePaymentSuccess = ({ _id: withdrawalId }) => {
    approveWithdrawalMutation.mutate({
      withdrawalId,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentSystemColor = (system) => {
    const colors = {
      bkash:
        " bg-pink-100 dark:bg-pink-500/20 dark:text-pink-300 text-pink-600 dark:border-pink-500/30 border-pink-400",
      rocket:
        "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-400 dark:border-purple-500/30",
      nagad:
        "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 dark:border-orange-500/30 border-orange-400",
      bank: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 dark:border-blue-500/30 border-blue-400",
      paypal:
        "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 dark:border-cyan-500/30 border-cyan-400",
    };
    return colors[system] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl">
            <FaUserTie className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Monitor platform statistics, manage users, and oversee withdrawal
            requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Workers */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className=" dark:text-gray-400 text-sm font-medium mb-1 text-gray-600">
                  Total Workers
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark:text-gray-400 text-sm font-medium mb-1 text-gray-600">
                  Total Buyers
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark:text-gray-400 text-sm font-medium mb-1 text-gray-600">
                  Available Coins
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark:text-gray-400 text-sm font-medium mb-1 text-gray-600">
                  Total Payments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl">
          <div className="p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-end sm:items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">
                  Pending Withdrawal Requests
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Review and approve withdrawal requests from workers
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-500/20  px-4 py-2 rounded-lg border border-orange-500/30">
                <FaClock className="w-5 h-5 text-orange-400" />
                <span className="text-orange-500 font-medium">
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
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Worker
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Acc Num.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {withdrawalRequests
                  .filter((request) => request.status === "pending")
                  .map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {request.worker_name}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {request.worker_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCoins className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {request.withdrawal_coin}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaDollarSign className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {request.withdrawal_amount.toFixed(2)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-mono text-sm">
                        {request.account_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(request.withdraw_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePaymentSuccess(request)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                          <span>
                            {approveWithdrawalMutation.isPending
                              ? "Processing...  "
                              : "Payment Success"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden p-6 space-y-4">
            {withdrawalRequests
              .filter((request) => request.status === "pending")
              .map((request) => (
                <div
                  key={request._id}
                  className="bg-white/5 dark:bg-white/5 rounded-xl p-4 border border-white/10 dark:border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900 dark:text-gray-100 font-medium">
                        {request.worker_name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
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
                      <p className="text-gray-600 dark:text-gray-500 text-xs mb-1">
                        Coins
                      </p>
                      <div className="flex items-center">
                        <FaCoins className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {request.withdrawal_coin}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                        Amount
                      </p>
                      <div className="flex items-center">
                        <FaDollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {request.withdrawal_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-500 text-xs mb-1">
                      Account Number
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                      {request.account_number}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-500 text-xs mb-1">
                      Request Date
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(request.withdraw_date)}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePaymentSuccess(request)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    <span>
                      {approveWithdrawalMutation.isPending
                        ? "Processing..."
                        : "Payment Success"}
                    </span>
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
