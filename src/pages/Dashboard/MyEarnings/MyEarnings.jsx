import { useQuery } from "@tanstack/react-query";
import { isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns";
import { useMemo } from "react";
import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function MyEarnings() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

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

  const earnings = useMemo(() => {
    let total = 0;
    let totalCashedOut = 0;
    let day = 0;
    let week = 0;
    let month = 0;
    let year = 0;

    deliveries.forEach((p) => {
      const deliveredAt = new Date(p.delivered_at);
      const isSameDistrict = p.receiverServiceCenter === p.senderServiceCenter;
      const earning = isSameDistrict ? p.cost * 0.8 : p.cost * 0.3;

      total += earning;
      if (p.cashout_status === "cashed_out") totalCashedOut += earning;

      if (isToday(deliveredAt)) day += earning;
      if (isThisWeek(deliveredAt, { weekStartsOn: 1 })) week += earning;
      if (isThisMonth(deliveredAt)) month += earning;
      if (isThisYear(deliveredAt)) year += earning;
    });

    return {
      total,
      totalCashedOut,
      remaining: total - totalCashedOut,
      day,
      week,
      month,
      year,
    };
  }, [deliveries]);

  if (isLoading)
    return <div className="text-center py-10">Loading earnings...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load earnings.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-6">
      <h2 className="text-3xl font-bold dark:text-white">My Earnings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">Total Earnings</p>
          <p className="text-2xl font-semibold text-emerald-600">
            ${earnings.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">Cashed Out</p>
          <p className="text-2xl font-semibold text-green-500">
            ${earnings.totalCashedOut.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">Remaining</p>
          <p className="text-2xl font-semibold text-yellow-500">
            ${earnings.remaining.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">Today</p>
          <p className="text-xl font-semibold">${earnings.day.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">This Week</p>
          <p className="text-xl font-semibold">${earnings.week.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-xl font-semibold">${earnings.month.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow">
          <p className="text-gray-500 text-sm">This Year</p>
          <p className="text-xl font-semibold">${earnings.year.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
