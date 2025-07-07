import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function CompletedDeliveriesPage() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: deliveries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completed-deliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/completed-deliveries", {
        params: { email: user.email },
      });
      return res.data;
    },
  });

  const deliveriesWithEarnings = deliveries.map((parcel) => {
    const isSameDistrict =
      parcel.receiverServiceCenter === parcel.senderServiceCenter;
    const earnings = isSameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.3;
    return { ...parcel, earnings };
  });

  const totalEarnings = deliveriesWithEarnings.reduce(
    (sum, p) => sum + p.earnings,
    0
  );
  const pendingEarnings = deliveriesWithEarnings.reduce(
    (sum, p) => (p.cashout_status !== "cashed_out" ? sum + p.earnings : sum),
    0
  );

  const cashoutMutation = useMutation({
    mutationFn: async (parcelId) => {
      await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["completed-deliveries", user?.email]);
    },
  });

  const handleCashout = async (parcel) => {
    const confirm = await Swal.fire({
      title: "Cash Out?",
      text: `Cash out $${parcel.earnings.toFixed(2)} for parcel ${
        parcel.parcelId
      }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
    });

    if (confirm.isConfirmed) {
      cashoutMutation.mutate(parcel.parcelId);
    }
  };

  if (isLoading)
    return <div className="text-center py-10">Loading deliveries...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load deliveries.
      </div>
    );

  if (deliveriesWithEarnings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        No completed deliveries found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-x-auto">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Completed Deliveries
      </h2>
      <table className="min-w-full border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              Title
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              Receiver
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              From
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              To
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              Delivered At
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              Cost ($)
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              Earnings ($)
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold dark:text-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
          {deliveriesWithEarnings.map((parcel) => (
            <tr
              key={parcel.parcelId}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                {parcel.title}
              </td>
              <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                {parcel.receiverName}
              </td>
              <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                {parcel.senderServiceCenter}
              </td>
              <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                {parcel.receiverServiceCenter}
              </td>
              <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                {new Date(parcel.delivered_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                {parcel.cost}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-emerald-600 font-semibold">
                {parcel.earnings.toFixed(2)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {parcel.cashout_status === "cashed_out" ? (
                  <span className="text-green-500 text-sm font-medium">
                    Cashed Out
                  </span>
                ) : (
                  <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleCashout(parcel)}
                    disabled={cashoutMutation.isLoading}
                  >
                    {cashoutMutation.isLoading ? "Processing..." : "Cash Out"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
            Total Earnings: ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
            Remaining Money: ${pendingEarnings.toFixed(2)}
          </p>
        </div>
        <button
          className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pendingEarnings === 0}
        >
          Cash Out All
        </button>
      </div>
    </div>
  );
}
