import { useState } from 'react';
import { FiHome, FiList, FiUpload, FiDollarSign, FiPlusCircle, FiUsers, FiSettings, FiBell } from 'react-icons/fi';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'buyer', or 'worker'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Dummy data
  const userData = {
    name: userRole === 'admin' ? 'Admin User' : userRole === 'buyer' ? 'John Buyer' : 'Sarah Worker',
    role: userRole,
    coins: 1250,
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  };

  const adminStats = {
    totalWorkers: 42,
    totalBuyers: 18,
    totalCoins: 12500,
    totalPayments: 56
  };

  const buyerStats = {
    totalTasks: 8,
    pendingTasks: 3,
    totalPaid: 1200
  };

  const workerStats = {
    totalSubmissions: 15,
    pendingSubmissions: 4,
    totalEarnings: 850
  };

  const pendingSubmissions = [
    { id: 1, worker_name: 'Worker 1', task_title: 'Design Logo', payable_amount: 50 },
    { id: 2, worker_name: 'Worker 2', task_title: 'Write Article', payable_amount: 30 }
  ];

  const approvedSubmissions = [
    { id: 1, task_title: 'Website Design', payable_amount: 100, buyer_name: 'Company A', status: 'approved' },
    { id: 2, task_title: 'Content Writing', payable_amount: 50, buyer_name: 'Company B', status: 'approved' }
  ];

  const withdrawalRequests = [
    { id: 1, user_name: 'User 1', amount: 200, status: 'pending' },
    { id: 2, user_name: 'User 2', amount: 150, status: 'pending' }
  ];

  const toggleRole = () => {
    setUserRole(userRole === 'admin' ? 'buyer' : userRole === 'buyer' ? 'worker' : 'admin');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 fixed h-full z-10`}>
        <div className="p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">TaskManager</h1>
          ) : (
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">TM</span>
          )}
        </div>
        
        <nav className="mt-6">
          {[
            { name: 'Home', icon: <FiHome /> },
            { name: 'TaskList', icon: <FiList /> },
            { name: 'My Submissions', icon: <FiUpload /> },
            { name: 'withdrawals', icon: <FiDollarSign /> },
            { name: 'Add new Tasks', icon: <FiPlusCircle /> },
            { name: 'My Task\'s', icon: <FiList /> },
            { name: 'Purchase Coin', icon: <FiDollarSign /> },
            { name: 'Payment history', icon: <FiDollarSign /> },
            { name: 'Manage Users', icon: <FiUsers /> },
            { name: 'Manage Task', icon: <FiSettings /> }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center w-full px-4 py-3 text-left ${activeTab === item.name 
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleRole}
              className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm"
            >
              Switch to {userRole === 'admin' ? 'Buyer' : userRole === 'buyer' ? 'Worker' : 'Admin'}
            </button>

            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">Coins: {userData.coins}</span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <FiBell className="text-gray-700 dark:text-gray-300" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium">Notifications</p>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <p className="text-sm">New task available</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <p className="text-sm">Submission approved</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <img 
                src={userData.image} 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover" 
              />
              {sidebarOpen && (
                <div className="text-right">
                  <p className="text-sm font-medium">{userData.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userData.role}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{activeTab}</h2>

          {activeTab === 'Home' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {userRole === 'admin' ? (
                  <>
                    <StatCard title="Total Workers" value={adminStats.totalWorkers} icon="👷" />
                    <StatCard title="Total Buyers" value={adminStats.totalBuyers} icon="👔" />
                    <StatCard title="Total Coins" value={adminStats.totalCoins} icon="🪙" />
                    <StatCard title="Total Payments" value={adminStats.totalPayments} icon="💳" />
                  </>
                ) : userRole === 'buyer' ? (
                  <>
                    <StatCard title="Total Tasks" value={buyerStats.totalTasks} icon="📋" />
                    <StatCard title="Pending Tasks" value={buyerStats.pendingTasks} icon="⏳" />
                    <StatCard title="Total Paid" value={`$${buyerStats.totalPaid}`} icon="💸" />
                    <StatCard title="Available Coins" value={userData.coins} icon="🪙" />
                  </>
                ) : (
                  <>
                    <StatCard title="Total Submissions" value={workerStats.totalSubmissions} icon="📤" />
                    <StatCard title="Pending Submissions" value={workerStats.pendingSubmissions} icon="⏳" />
                    <StatCard title="Total Earnings" value={`$${workerStats.totalEarnings}`} icon="💸" />
                    <StatCard title="Available Coins" value={userData.coins} icon="🪙" />
                  </>
                )}
              </div>

              {/* Tables */}
              {userRole === 'admin' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Withdrawal Requests</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {withdrawalRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{request.user_name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">${request.amount}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {userRole === 'buyer' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tasks to Review</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Worker</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {pendingSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{submission.worker_name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{submission.task_title}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">${submission.payable_amount}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 mr-2">
                                View
                              </button>
                              <button className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 mr-2">
                                Approve
                              </button>
                              <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {userRole === 'worker' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Approved Submissions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {approvedSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{submission.task_title}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">${submission.payable_amount}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{submission.buyer_name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                {submission.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

export default Dashboard;