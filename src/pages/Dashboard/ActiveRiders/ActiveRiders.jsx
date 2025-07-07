import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaInfoCircle, FaSpinner, FaTimes, FaUserSlash } from "react-icons/fa"; // Using Fa from react-icons/fa
import Swal from "sweetalert2"; // Import SweetAlert2
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Function to fetch active riders

// Main Component to display Active Riders
const ActiveRiders = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const fetchActiveRiders = async () => {
    const { data } = await axiosSecure.get(`/riders/active`);
    return data;
  };

  // TanStack Query hook to fetch active riders data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: fetchActiveRiders,
  });

  // Mutation for deactivating a rider
  const deactivateRiderMutation = useMutation({
    mutationFn: async ({ riderId, email }) => {
      // This will send a PATCH request to update the rider's status to 'inactive'
      const { data } = await axiosSecure.patch(
        `/riders/${riderId}/update-status`,
        {
          status: "pending",
          email,
        }
      );
      return data;
    },
    onSuccess: (updatedRider) => {
      console.log(`Rider ${updatedRider.name} deactivated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["activeRiders"] }); // Invalidate and refetch active riders
      queryClient.invalidateQueries({ queryKey: ["pendingRiders"] }); // Also invalidate pending if status changes affect that list
      Swal.fire({
        icon: "success",
        title: "Deactivated!",
        text: `Rider ${updatedRider.name} has been deactivated.`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (err) => {
      console.error("Error deactivating rider:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to deactivate rider: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`,
      });
    },
  });

  // Handler for deactivating a rider with SweetAlert2 confirmation
  const handleDeactivateRider = (rider) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to deactivate rider ${rider.name}? They will no longer be active.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate!",
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateRiderMutation.mutate({
          riderId: rider._id,
          email: rider.email,
        });
      }
    });
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">
        <FaSpinner className="animate-spin h-8 w-8 mr-3" />
        <p className="text-lg">Loading active riders...</p>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-600 dark:text-red-400">
        <FaTimes className="h-10 w-10 mb-4" />
        <p className="text-lg font-semibold">
          Error loading active riders: {error.message}
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
        Active Riders
      </h1>

      {/* --- No Data State --- */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
            No active riders found.
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
                    Status
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
                    key={rider.id}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {rider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* You can add a view details button here if needed */}
                        {/* <button
                          onClick={() => console.log('View details for', rider.name)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          title="View Details"
                        >
                          <FaInfoCircle className="h-5 w-5" />
                        </button> */}
                        <button
                          onClick={() => handleDeactivateRider(rider)}
                          disabled={deactivateRiderMutation.isLoading}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Deactivate Rider"
                        >
                          <FaUserSlash className="h-5 w-5" />
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
                key={rider.id}
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
                  <strong>Status:</strong>{" "}
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {rider.status}
                  </span>
                </p>

                <div className="flex justify-end space-x-3 mt-4">
                  {/* You can add a view details button here if needed */}
                  <button
                    onClick={() => console.log("View details for", rider.name)}
                    className="flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                  >
                    <FaInfoCircle className="mr-2" /> Details
                  </button>
                  <button
                    onClick={() => handleDeactivateRider(rider)}
                    disabled={deactivateRiderMutation.isLoading}
                    className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaUserSlash className="mr-2" /> Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveRiders;
