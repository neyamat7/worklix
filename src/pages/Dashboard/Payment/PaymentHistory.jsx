import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiCheckCircle, FiCreditCard, FiXCircle } from "react-icons/fi";
import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
        Failed to load payment history. Please try again later.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Payment History
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment List */}
        <div className="lg:col-span-2 space-y-4">
          {payments?.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No payment history found
              </p>
            </div>
          ) : (
            payments?.map((payment) => (
              <div
                key={payment._id}
                onClick={() => setSelectedPayment(payment)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                  selectedPayment?._id === payment._id
                    ? "ring-2 ring-indigo-500"
                    : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-full ${
                          payment.status === "paid"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300"
                        }`}
                      >
                        {payment.status === "paid" ? (
                          <FiCheckCircle size={20} />
                        ) : (
                          <FiXCircle size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount, payment.currency)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.parcelId?.slice(-6) || "N/A"} •{" "}
                          {formatDate(payment.paid_at_string)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === "paid"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sticky top-6">
            {selectedPayment ? (
              <>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                  Payment Details
                </h2>

                <div className="space-y-5">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Amount
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(
                        selectedPayment.amount,
                        selectedPayment.currency
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    <span
                      className={`font-medium ${
                        selectedPayment.status === "paid"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {selectedPayment.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Date
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedPayment.paid_at_string)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Parcel ID
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPayment.parcelId?.slice(-6) || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Payment Method
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPayment.paymentMethod?.join(", ") || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Transaction ID
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white break-all text-right">
                      {selectedPayment.paymentIntentId}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FiCreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  Select a payment to view details
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
