import { FaCoins } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

const TaskModal = ({ selectedTask, setIsModalOpen }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {selectedTask.task_title}
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-red-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {selectedTask.task_image_url && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={selectedTask.task_image_url}
                alt="Task"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Task Details
              </h3>
              <p className="text-gray-800 dark:text-gray-200">
                {selectedTask.task_detail}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Submission Info
              </h3>
              <p className="text-gray-800 dark:text-gray-200">
                {selectedTask.submission_info}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiUsers className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Workers
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Required
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedTask.required_workers}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedTask.total_paid_workers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCoins className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Per Worker
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedTask.payable_amount} coins
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Paid
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedTask.total_paid_amount}{" "}
                    {selectedTask.total_paid_amount === 1 ? "coin" : "coins"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedTask.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Deadline
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedTask.completion_date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
