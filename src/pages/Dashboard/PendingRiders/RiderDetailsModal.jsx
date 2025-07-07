import { FaTimes } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";

const RiderDetailsModal = ({ rider, onClose, onDecision }) => {
  if (!rider) return null; // Don't render if no rider data is provided

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative transform transition-all duration-300 scale-100 opacity-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes className="h-6 w-6" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Rider Details: {rider.name}
        </h2>

        {/* Rider Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 dark:text-gray-300">
          <p>
            <strong>ID:</strong>{" "}
            <span className="break-all text-sm">{rider.id}</span>
          </p>
          <p>
            <strong>Email:</strong> {rider.email}
          </p>
          <p>
            <strong>NID:</strong> {rider.nid}
          </p>
          <p>
            <strong>Phone:</strong> {rider.phone}
          </p>
          <p>
            <strong>Bike Reg:</strong> {rider.bikeReg}
          </p>
          <p>
            <strong>Bike CC:</strong> {rider.bikeCC}
          </p>
          <p>
            <strong>Region:</strong> {rider.region}
          </p>
          <p>
            <strong>District:</strong> {rider.district}
          </p>
          <p className="md:col-span-2">
            <strong>Address:</strong> {rider.address}
          </p>
          <p>
            <strong>Terms Accepted:</strong> {rider.terms ? "Yes" : "No"}
          </p>
          <p>
            <strong>Role:</strong> {rider.role}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(rider.create_at).toLocaleString()}
          </p>
          <p>
            <strong>Last Login:</strong>{" "}
            {new Date(rider.last_log_in).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons within Modal */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => onDecision(rider._id, "reject", rider.email)}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            <FaTimes className="inline-block mr-2" /> Cancel Rider
          </button>
          <button
            onClick={() => onDecision(rider._id, "accept", rider.email)}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            <FaUserCheck className="inline-block mr-2" /> Accept Rider
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderDetailsModal;
