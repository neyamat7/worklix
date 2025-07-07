import { useQuery } from "@tanstack/react-query";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaTruck,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusIcons = {
  delivered: <FaCheckCircle className="text-green-500 h-6 w-6" />,
  in_transit: <FaTruck className="text-blue-500 h-6 w-6" />,
  rider_assigned: <FaClock className="text-yellow-500 h-6 w-6" />,
  not_collected: <FaHourglassHalf className="text-gray-500 h-6 w-6" />,
  default: <FaBoxOpen className="text-indigo-500 h-6 w-6" />,
};

export default function AdminDashboard() {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["deliveryStatusSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/status-summary");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p>Failed to load status summary. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Delivery Status Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.map((status) => (
          <div
            key={status.delivery_status}
            className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="mr-4">
              {statusIcons[status.delivery_status] || statusIcons.default}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                {status.delivery_status.replace(/_/g, " ")}
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {status.count} Parcels
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
