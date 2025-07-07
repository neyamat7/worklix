import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useUpdateTrackings } from "../../../hooks/useUpdateTrackings";

export default function PendingDeliveries() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const updateParcelTrackings = useUpdateTrackings();

  // Fetch all assigned deliveries
  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["riderParcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider-pending?email=${user?.email}`
      );
      return res.data;
    },
  });

  // Mutation to update delivery_status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcel, status }) => {
      await axiosSecure.patch(`/parcels/${parcel._id}/update-status`, {
        delivery_status: status,
      });
    },
    onSuccess: (_, variables) => {
      updateParcelTrackings.mutate({
        tracking_id: variables.parcel.tracking_id,
        status: variables.status,
        details: `${
          variables.status === "in_transit" ? "picked up" : "delivered"
        } by ${user?.displayName}`,
        updated_by: user?.email,
      });

      queryClient.invalidateQueries(["riderParcels", user?.email]);
    },
  });

  if (isLoading) return <DeliverySkeleton />;
  if (isError) return <ErrorState />;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Pending Deliveries
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            {parcels.length} {parcels.length === 1 ? "delivery" : "deliveries"}{" "}
            assigned to you
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <FiClock className="text-indigo-500" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Delivery List */}
      <div className="space-y-4">
        {parcels.length === 0 ? (
          <EmptyState />
        ) : (
          parcels.map((parcel) => (
            <DeliveryCard
              key={parcel._id}
              parcel={parcel}
              updateStatus={updateStatusMutation.mutate}
            />
          ))
        )}
      </div>
    </div>
  );
}

const DeliveryCard = ({ parcel, updateStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Parcel Info */}
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
              <FiPackage className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {parcel.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {parcel.parcelId}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiMapPin className="mr-1.5" />
                <span>{parcel.receiverAddress}</span>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <StatusBadge status={parcel.delivery_status} />

            {parcel.delivery_status === "rider_assigned" && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  updateStatus({
                    parcel: parcel,
                    status: "in_transit",
                  })
                }
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <FiTruck className="mr-2" />
                Pick Up
              </motion.button>
            )}

            {parcel.delivery_status === "in_transit" && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  updateStatus({
                    parcel: parcel,
                    status: "delivered",
                  })
                }
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FiCheckCircle className="mr-2" />
                Mark Delivered
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    rider_assigned:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    in_transit:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    delivered:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
        statusStyles[status] || "bg-gray-100"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="mx-auto h-24 w-24 text-gray-400">
      <FiPackage className="w-full h-full" />
    </div>
    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
      No pending deliveries
    </h3>
    <p className="mt-1 text-gray-500 dark:text-gray-400">
      You currently don't have any assigned deliveries.
    </p>
  </div>
);

const ErrorState = () => (
  <div className="text-center py-12">
    <div className="mx-auto h-24 w-24 text-red-400">
      <FiPackage className="w-full h-full" />
    </div>
    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
      Failed to load deliveries
    </h3>
    <p className="mt-1 text-gray-500 dark:text-gray-400">
      Please try again later.
    </p>
  </div>
);

const DeliverySkeleton = () => (
  <div className="p-4 max-w-7xl mx-auto space-y-4">
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
