import { useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiGrid,
  FiList,
  FiX,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import useUserPayments from "../../../../hooks/userUserPayments";

const PaymentRecords = () => {
  const [viewMode, setViewMode] = useState("table");

  const { user } = useSelector((state) => state.auth);

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useUserPayments(user?.email);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amount is in cents
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "succeeded":
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case "failed":
        return <FiX className="w-4 h-4 text-red-500" />;
      case "pending":
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1";
    switch (status) {
      case "succeeded":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  const getPackageInfo = (packageId) => {
    const packages = {
      starter: { name: "Starter", gradient: "from-blue-500 to-cyan-500" },
      popular: { name: "Popular", gradient: "from-purple-500 to-pink-500" },
      professional: {
        name: "Professional",
        gradient: "from-orange-500 to-red-500",
      },
      enterprise: {
        name: "Enterprise",
        gradient: "from-green-500 to-emerald-500",
      },
    };
    return (
      packages[packageId] || {
        name: packageId,
        gradient: "from-gray-500 to-gray-600",
      }
    );
  };

  const totalSpent = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount_paid, 0);

  const totalCoins = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.coins_purchased, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiX className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            Failed to load payment history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Payment History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track all your coin purchases and transactions
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatAmount(totalSpent, "usd")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Coins
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalCoins}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🪙</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {payments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FiCreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls view mode */}

          <div className="hidden lg:flex flex-col lg:flex-row lg:items-center lg:justify-end space-y-4 lg:space-y-0 mb-6">
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "cards"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Export Button */}
              <button className="no-print flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>

          {/* Payment Data */}
          {payments.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center">
              <FiCreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No payments found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You haven't made any payments yet
              </p>
            </div>
          ) : viewMode === "table" ? (
            /* Table View - Hidden on small screens */
            <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 dark:bg-gray-700/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Coins
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {payments.map((payment) => {
                      const packageInfo = getPackageInfo(payment.package_id);
                      return (
                        <tr
                          key={payment._id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${packageInfo.gradient}`}
                              ></div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {packageInfo.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {payment.coins_purchased}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                coins
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatAmount(
                                payment.amount_paid,
                                payment.currency
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(payment.status)}>
                              {getStatusIcon(payment.status)}
                              <span className="capitalize">
                                {payment.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <FiCalendar className="w-4 h-4" />
                              <span>{formatDate(payment.payment_date)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {payment.payment_intent_id.slice(-8)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card View - Always visible, responsive */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {payments.map((payment) => {
                const packageInfo = getPackageInfo(payment.package_id);
                return (
                  <div
                    key={payment._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${packageInfo.gradient}`}
                        ></div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {packageInfo.name} Package
                        </h3>
                      </div>
                      <span className={getStatusBadge(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Coins Purchased
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {payment.coins_purchased}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            coins
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Amount Paid
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatAmount(payment.amount_paid, payment.currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Payment Date
                        </span>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          <span>{formatDate(payment.payment_date)}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Transaction ID
                          </span>
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {payment.payment_intent_id.slice(-12)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show card view on large screens when table is selected but force cards on mobile */}
          {viewMode === "table" && (
            <div className="lg:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {payments.map((payment) => {
                  const packageInfo = getPackageInfo(payment.package_id);
                  return (
                    <div
                      key={payment._id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full bg-gradient-to-r ${packageInfo.gradient}`}
                          ></div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {packageInfo.name} Package
                          </h3>
                        </div>
                        <span className={getStatusBadge(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="capitalize">{payment.status}</span>
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Coins Purchased
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {payment.coins_purchased}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              coins
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Amount Paid
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatAmount(
                              payment.amount_paid,
                              payment.currency
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Payment Date
                          </span>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <FiCalendar className="w-4 h-4" />
                            <span>{formatDate(payment.payment_date)}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Transaction ID
                            </span>
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {payment.payment_intent_id.slice(-12)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentRecords;
