import { FaCoins } from "react-icons/fa";
import {
  FiAward,
  FiCalendar,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiTarget,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import ErrorMessage from "../../../../components/shared/ErrorMessage/ErrorMessage";
import Loading from "../../../../components/shared/Loading/Loading";
import useAuth from "../../../../context/AuthContext";
import { usePaginatedSubmissions } from "../../../../hooks/usePaginatedSubmissions";

const WorkerHome = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = usePaginatedSubmissions(user?.email, 1);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // Calculate stats
  const totalSubmissions = data?.allSubmissions.length;
  const pendingSubmissions = data?.allSubmissions.filter(
    (s) => s.status === "pending"
  ).length;
  const approvedSubmissions = data?.allSubmissions.filter(
    (s) => s.status === "approved"
  );
  const totalEarnings = approvedSubmissions?.reduce(
    (sum, s) => sum + parseInt(s.payable_amount),
    0
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto">
        <div className="relative z-10 h-full p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-4">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Worker Home
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Track your submissions and earnings
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {/* Total Submissions */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Submissions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {totalSubmissions}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                      All time
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiFileText className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Pending Submissions */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Pending Submissions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {pendingSubmissions}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex">
                      <FiClock className="w-3 h-3 mr-1" />
                      Under review
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiClock className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Approved Submissions */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Approved Submissions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {approvedSubmissions.length}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex ">
                      <FiAward className="w-3 h-3 mr-1" />
                      Completed
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {totalEarnings}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex">
                      <FiTarget className="w-3 h-3 mr-1" />
                      From approved
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaCoins className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Submissions Section */}
            <div className="bg-white/80  dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Approved Submissions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your successfully completed and approved tasks
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <FiCheck className="w-5 h-5" />
                    <span className="font-semibold">
                      {approvedSubmissions.length} Approved
                    </span>
                  </div>
                </div>
              </div>

              {approvedSubmissions.length === 0 ? (
                <div className="p-12 text-center">
                  <FiCheck className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No approved submissions yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete tasks to see your approved submissions here
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80 dark:bg-gray-700/80">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Task Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Buyer
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {approvedSubmissions.map((submission, index) => (
                          <tr
                            key={submission._id}
                            className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                                {submission.task_title}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <FiUser className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {submission.buyer_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 ">
                              <div className="flex items-center justify-center">
                                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400 flex gap-1">
                                  <FaCoins className="w-4 h-4 mr-1" />
                                  {submission.payable_amount}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  <FiCheck className="w-3 h-3 mr-1" />
                                  Approved
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                <FiCalendar className="w-4 h-4" />
                                <span>
                                  {formatDate(submission.submission_date)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="sm:hidden p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {approvedSubmissions.map((submission, index) => (
                        <div
                          key={submission._id}
                          className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2 flex-1 mr-3">
                              {submission.task_title}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap">
                              <FiCheck className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <FiUser className="w-4 h-4" />
                                <span>Buyer</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {submission.buyer_name}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <FiDollarSign className="w-4 h-4" />
                                <span>Earnings</span>
                              </div>
                              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                                {submission.payable_amount} coins
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <FiCalendar className="w-4 h-4" />
                                <span>Completed</span>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(submission.submission_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
