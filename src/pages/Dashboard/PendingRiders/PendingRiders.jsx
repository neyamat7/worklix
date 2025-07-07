import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { FaInfoCircle, FaSpinner, FaTimes, FaUserCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import RiderDetailsModal from "./RiderDetailsModal";

// Modal Component for displaying detailed Rider Information

// Main Component to display Pending Riders
const PendingRiders = () => {
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const axiosSecure = useAxiosSecure();

  const fetchPendingRiders = async () => {
    const { data } = await axiosSecure.get(`/riders/pending`);
    return data;
  };

  // TanStack Query hook to fetch pending riders data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: fetchPendingRiders,
  });

  console.log(data);
  // Dummy mutation for accepting a rider
  // In a real app, this would interact with your backend API
  const { mutate: updateRiderStatus, isLoading: isAcceptingRider } =
    useMutation({
      mutationFn: async ({ riderId, action, email }) => {
        // patch request to update rider status to "accepted"
        const response = await axiosSecure.patch(
          `/riders/${riderId}/update-status`,
          {
            status: action === "accept" ? "active" : "reject",
            email,
          }
        );
        return response.data;
      },
      onSuccess: (data) => {

        

        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["pendingRiders"] }); // Invalidate and refetch pending riders
        // setShowModal(false); // Close modal after successful action
        // setSelectedRider(null); // Clear selected rider
        // If you have an 'activeRiders' query, you might invalidate it here too:
        // queryClient.invalidateQueries({ queryKey: ['activeRiders'] });
      },
      onError: (err) => {
        console.error("Error accepting rider (dummy):", err);
        // Implement a user-friendly error notification here (e.g., a toast message)
      },
      onSettled: () => {
        setShowModal(false);
        setSelectedRider(null);
      },
    });

  // Handler to open the modal with rider details
  const handleViewDetails = (rider) => {
    setSelectedRider(rider);
    setShowModal(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRider(null);
  };

  // Handler for accepting a rider with SweetAlert2 confirmation
  const handleDecision = (riderId, action, email) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} rider ${selectedRider?.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRiderStatus({ riderId, action, email });
      }
    });
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">
        <FaSpinner className="animate-spin h-8 w-8 mr-3" />
        <p className="text-lg">Loading pending riders...</p>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-600 dark:text-red-400">
        <FaTimes className="h-10 w-10 mb-4" />
        <p className="text-lg font-semibold">
          Error loading riders: {error.message}
        </p>
        <button
          onClick={() => refetch()} // Allow retrying the fetch
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-inter">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Pending Rider Applications
      </h1>

      {/* --- No Data State --- */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
            No pending riders found.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          {/* --- Desktop Table View (hidden on small screens) --- */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Bike CC
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Applied On
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((rider) => (
                  <tr
                    key={rider._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {rider.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {rider.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {rider.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {rider.bikeCC}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {rider.district}, {rider.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(rider.create_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(rider)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          title="View Details"
                        >
                          <FaInfoCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDecision(rider._id, "accept", rider.email)
                          }
                          disabled={isAcceptingRider}
                          className="p-2 text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 transition-colors rounded-full hover:bg-green-100 dark:hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Accept Rider"
                        >
                          <FaUserCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDecision(rider._id, "reject", rider.email)
                          }
                          disabled={isAcceptingRider}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Cancel Rider"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Mobile Card View (hidden on large screens) --- */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {data.map((rider) => (
              <div
                key={rider._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {rider.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {rider.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Phone:</strong> {rider.phone}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Bike CC:</strong> {rider.bikeCC}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Location:</strong> {rider.district}, {rider.region}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Applied On:</strong>{" "}
                  {new Date(rider.create_at).toLocaleDateString()}
                </p>

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => handleViewDetails(rider)}
                    className="flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                  >
                    <FaInfoCircle className="mr-2" /> Details
                  </button>
                  <button
                    onClick={() =>
                      handleDecision(rider._id, "accept", rider.email)
                    }
                    disabled={isAcceptingRider}
                    className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaUserCheck className="mr-2" /> Accept
                  </button>
                  <button
                    onClick={() =>
                      handleDecision(rider._id, "reject", rider.email)
                    }
                    disabled={isAcceptingRider}
                    className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rider Details Modal */}
      {showModal && (
        <RiderDetailsModal
          rider={selectedRider}
          onClose={handleCloseModal}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
};

export default PendingRiders;
