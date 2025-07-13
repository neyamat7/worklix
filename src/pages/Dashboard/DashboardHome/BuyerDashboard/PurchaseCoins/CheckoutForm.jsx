import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { FiCreditCard, FiLoader, FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
import { useTheme } from "../../../../../hooks/useTheme";
// import { useSingleUserData } from "../../../../../hooks/useUserData";

const CheckoutForm = ({ selectedPackage, onSuccess, onCancel }) => {
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  //   const { refetch } = useSingleUserData(user?.email);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: user?.displayName,
          email: user?.email,
        },
      });

      if (error) {
        setPaymentError(error.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      // create payment and update user's coin
      const { data } = await axiosSecure.post(
        "payments/create-payment-intent",
        {
          amount: selectedPackage.price * 100,
          currency: "usd",
          coins: selectedPackage.coins,
        }
      );

      // Confirm payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(data.client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.displayName,
              email: user?.email,
            },
          },
        });

      if (confirmError) {
        setPaymentError(confirmError.message || "Payment failed");
      } else {
        onSuccess(paymentIntent, selectedPackage);
      }
    } catch (error) {
      setPaymentError("Payment failed. Please try again.");
      console.error("Payment error:", error);
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: theme === "dark" ? "#fff" : "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Complete Payment
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Package Summary */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedPackage.coins} Coins
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Digital Currency
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${selectedPackage.price}
              </div>
              {selectedPackage.savings && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  {selectedPackage.savings}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Card Element Container */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Card Information
            </label>
            <div className="relative">
              {/* Credit Card Visual */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-4 text-white shadow-lg">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
                    <div className="w-6 h-4 bg-yellow-300 rounded-sm"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">VALID THRU</div>
                    <div className="text-sm font-mono">12/28</div>
                  </div>
                </div>
                <div className="font-mono text-lg tracking-wider mb-4">
                  •••• •••• •••• ••••
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80">CARDHOLDER NAME</div>
                    <div className="text-sm font-medium">JOHN DOE</div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-red-500 rounded-sm flex items-center justify-center">
                      <div className="w-6 h-3 bg-red-400 rounded-full"></div>
                    </div>
                    <div className="w-8 h-5 bg-orange-500 rounded-sm flex items-center justify-center">
                      <div className="w-6 h-3 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stripe Card Element */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <FiShield className="w-5 h-5" />
              <span className="text-sm font-medium">Secured by Stripe</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">
                {paymentError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2 ${
              isProcessing || !stripe
                ? "opacity-50 cursor-not-allowed transform-none"
                : ""
            }`}
          >
            {isProcessing ? (
              <>
                <FiLoader className="animate-spin h-5 w-5" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiCreditCard className="w-5 h-5" />
                <span>Pay ${selectedPackage.price}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
