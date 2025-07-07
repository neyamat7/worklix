import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiPackage,
  FiTrash2,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusBadge = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case "Pending":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          {status}
        </span>
      );
    case "Delivered":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          {status}
        </span>
      );
    case "Cancelled":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          {status}
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          {status}
        </span>
      );
  }
};

const paymentBadge = (status) => {
  return status === "paid" ? (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <FiCheckCircle className="mr-1" /> Paid
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <FiXCircle className="mr-1" /> Unpaid
    </span>
  );
};

const MyParcels = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchParcels = async () => {
    const response = await axiosSecure.get(`/parcels?email=${user?.email}`);
    return response.data.data;
  };

  const { user } = useAuth();
  const {
    data: parcels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcels", user?.email],
    queryFn: fetchParcels,
  });

  // delete mutation
  const { mutate: deleteParcel } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/parcels/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["parcels"]);
      Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Failed to delete parcel", "error");
    },
  });

  // handle delete function
  const handleDeleteParcel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteParcel(id);
      }
    });
  };

  // pay for parcel
  const handlePayParcel = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const sortedParcels = parcels?.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading)
    return <div className="p-4 text-center">Loading parcels...</div>;
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">Error fetching parcels</div>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 ">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
            My Parcels
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage all your shipments
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FiPackage className="mr-2" /> New Parcel
          </button>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {sortedParcels?.map((parcel) => (
          <div
            key={parcel.parcelId}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{parcel.title}</h3>
                  <p className="text-sm text-gray-500">
                    ID: {parcel.tracking_id}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {statusBadge(parcel.status)}
                  {paymentBadge(parcel.payment_status)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="font-medium">{parcel.senderName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="font-medium">{parcel.receiverName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cost</p>
                  <p className="font-medium">${parcel.cost}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(parcel.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <FiTruck className="mr-1" />
                  <span className="capitalize">
                    {parcel.delivery_status.replace("_", " ")}
                  </span>
                </div>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <div className="shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-500">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    {sortConfig.key === "title" &&
                      (sortConfig.direction === "asc" ? (
                        <FiArrowUp className="ml-1" />
                      ) : (
                        <FiArrowDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("cost")}
                >
                  <div className="flex items-center">
                    Cost
                    {sortConfig.key === "cost" &&
                      (sortConfig.direction === "asc" ? (
                        <FiArrowUp className="ml-1" />
                      ) : (
                        <FiArrowDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    Created
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? (
                        <FiArrowUp className="ml-1" />
                      ) : (
                        <FiArrowDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Payment
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
              {sortedParcels?.map((parcel) => (
                <tr
                  key={parcel.parcelId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      {parcel.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {parcel.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      ${parcel.cost}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {formatDate(parcel.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {statusBadge(parcel.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {paymentBadge(parcel.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 rounded-md"
                        title="View"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePayParcel(parcel._id)}
                        className={`p-2 rounded-md ${
                          parcel.payment_status === "paid"
                            ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-600"
                            : "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-600"
                        }`}
                        title={
                          parcel.payment_status === "paid"
                            ? "Already Paid"
                            : "Pay Now"
                        }
                        disabled={parcel.payment_status === "paid"}
                      >
                        {parcel.payment_status === "paid" ? "Paid" : "Pay"}
                      </button>
                      <button
                        onClick={() => handleDeleteParcel(parcel._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded-md"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyParcels;
