import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCreditCard, FaSpinner } from "react-icons/fa";
import { IoCheckmarkDone } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useUpdateTrackings } from "../../../hooks/useUpdateTrackings";

const PaymentForm = () => {
  const updateParcelTrackings = useUpdateTrackings();
  const navigate = useNavigate();
  const { user } = useAuth();
  const stripe = useStripe(); // Stripe object
  const elements = useElements(); // Stripe UI elements
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const fetchParcelById = async (parcelId) => {
    try {
      const response = await axiosSecure.get(`parcels/${parcelId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch parcel"
      );
    }
  };

  // get parcel data by tanstack query by parcel id
  const {
    data: parcel,
    isLoading,
    isError,
    error: getParcelError,
  } = useQuery({
    queryKey: ["parcel", id], // Unique key for this query
    queryFn: () => fetchParcelById(id),
    enabled: !!id, // Only run the query if parcelId exists
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) return;

      // Use your card Element with other Stripe.js APIs
      // optional
      const { error: PaymentMethodError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (PaymentMethodError) {
        setError(PaymentMethodError.message);
        setLoading(false);
        return;
      }

      // Confirm the card payment
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: parcel.cost * 100,
        id,
      });

      const { error: ConfirmationError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName,
              email: user?.email,
            },
          },
        });

      console.log("secret", data.clientSecret);

      if (ConfirmationError) {
        setError(ConfirmationError.message);
        setLoading(false);
        return;
      }

      // save payment to database
      const result = await axiosSecure.post("/save-payment", {
        parcelId: id,
        paymentMethod: paymentIntent.payment_method_types,
        amount: parcel.cost * 100,
        paymentIntentId: paymentIntent.id,
        userEmail: user?.email,
      });
      if (result.status === 200) {
        setPaymentCompleted(true);
        console.log("Payment succeeded:", paymentIntent);
        toast.success("Payment successful! Welcome back.");

        // update trackins
        updateParcelTrackings.mutate({
          tracking_id: parcel.tracking_id,
          status: "payment_done",
          details: `paid by ${user?.displayName}`,
          updated_by: user?.email,
        });

        navigate("/dashboard/my-parcels");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed");
      setPaymentCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center mt-10">
        <p className="text-red-600">{getParcelError.message}</p>
      </div>
    );
  }

  return (
    <div className="w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaCreditCard className="text-indigo-600" />
        Payment Details
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Card Element Container */}
        <div className="p-4 border border-gray-200 rounded-lg mb-6 hover:border-indigo-300 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={!stripe || loading || paymentCompleted}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
            ${
              paymentCompleted
                ? "bg-green-500 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
            ${(!stripe || loading) && "opacity-70 cursor-not-allowed"}
          `}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : paymentCompleted ? (
            <>
              <IoCheckmarkDone />
              Payment Successful!
            </>
          ) : (
            `Pay $${parcel?.cost ? parcel?.cost : 0}`
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
            clipRule="evenodd"
          />
        </svg>
        Test card: 4242 4242 4242 4242
      </div>

      {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default PaymentForm;
