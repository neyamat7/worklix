import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaCheck,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaMotorcycle,
  FaPhone,
  FaUser,
  FaWeightHanging,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useUpdateTrackings } from "../../../hooks/useUpdateTrackings";

const AssignRider = () => {
  const [selectedParcel, setSelectedParcel] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const updateParcelTrackings = useUpdateTrackings();
  const { user } = useAuth();
  // Fetch paid parcels with not_collected status
  const {
    data: parcels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/parcels/assignable", {
        params: {
          payment_status: "paid",
          delivery_status: "not_collected",
        },
      });
      return data.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
    },
  });

  // Fetch eligible riders for the selected parcel
  const { data: eligibleRiders, isLoading: isLoadingRiders } = useQuery({
    queryKey: ["eligibleRiders", selectedParcel?.senderServiceCenter],
    queryFn: async () => {
      if (!selectedParcel) return [];
      const { data } = await axiosSecure.get("/riders/eligible", {
        params: {
          district: selectedParcel.senderServiceCenter,
          status: "active", // Only approved riders
        },
      });
      return data;
    },
    enabled: !!selectedParcel,
  });

  // assign rider mutation
  const { mutateAsync: assignRider, isLoading: isAssigningRider } = useMutation(
    {
      mutationFn: async ({ parcelId, riderId, riderName, riderEmail }) => {
        await axiosSecure.patch("/assign-rider", {
          parcelId,
          riderId,
          riderName,
          riderEmail,
        });
      },
      onSuccess: (_, variables) => {
        toast.success("Rider assigned successfully!");
        queryClient.invalidateQueries(["assignableParcels"]);
        queryClient.invalidateQueries([
          "eligibleRiders",
          selectedParcel?.senderServiceCenter,
        ]);

        updateParcelTrackings.mutate({
          tracking_id: variables.tracking_id,
          status: "assigned_rider",
          details: `assined to ${variables?.riderName}`,
          updated_by: user?.email,
        });
      },
      onError: (error) => {
        toast.error(
          `Failed to assign rider: ${
            error.response?.data?.message || error.message
          }`
        );
      },
      onSettled: () => {
        closeModal();
      },
    }
  );

  const openAssignModal = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
  };

  const handleAssignRider = (rider) => {
    // console.log(rider);
    // console.log(selectedParcel);
    // TODO: Implement actual assignment logic
    console.log(`Assigning rider ${rider._id} to parcel ${selectedParcel._id}`);

    assignRider({
      parcelId: selectedParcel._id,
      riderId: rider._id,
      riderName: rider.name,
      riderEmail: rider.email,
      tracking_id: selectedParcel.tracking_id,
    });
    // After assignment:
    // closeModal();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p>Failed to load parcels. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Assign Rider
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          List of paid parcels that need rider assignment
        </p>
      </div>

      {parcels?.length === 0 ? (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p>No parcels need rider assignment at this time.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {parcels?.map((parcel) => (
            <div
              key={parcel._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
                    {parcel.title}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-200">
                    {parcel.type}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaBox className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tracking ID
                      </p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {parcel.tracking_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaWeightHanging className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Weight
                      </p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {parcel.weight} kg
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaMoneyBillWave className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cost
                      </p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        ৳{parcel.cost.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Paid At
                      </p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {new Date(parcel.paidAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => openAssignModal(parcel)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <FaMotorcycle className="h-5 w-5 mr-2" />
                      {isAssigningRider ? "Assigning..." : "Assign Rider"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rider Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Select Rider for {selectedParcel?.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Sender Service Center:</span>{" "}
                  {selectedParcel?.senderServiceCenter}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Showing riders available in this district
                </p>
              </div>

              {isLoadingRiders ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : eligibleRiders?.length === 0 ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                  <p>
                    No available riders in {selectedParcel?.senderServiceCenter}{" "}
                    district.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {eligibleRiders?.map((rider) => (
                    <div
                      key={rider._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center">
                            <FaUser className="h-4 w-4 mr-2 text-indigo-500" />
                            {rider.name}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="flex items-center text-gray-600 dark:text-gray-300">
                              <FaPhone className="h-4 w-4 mr-2 text-indigo-500" />
                              {rider.phone}
                            </p>
                            <p className="flex items-center text-gray-600 dark:text-gray-300">
                              <FaMapMarkerAlt className="h-4 w-4 mr-2 text-indigo-500" />
                              {rider.district}, {rider.region}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignRider(rider)}
                          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                          <FaCheck className="h-4 w-4 mr-2" />
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
