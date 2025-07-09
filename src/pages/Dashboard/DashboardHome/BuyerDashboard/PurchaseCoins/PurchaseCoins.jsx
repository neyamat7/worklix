"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import {
  FiAward,
  FiCheck,
  FiCreditCard,
  FiLoader,
  FiMoon,
  FiShield,
  FiStar,
  FiSun,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const coinPackages = [
  {
    id: "starter",
    coins: 10,
    price: 1,
    icon: <FiZap className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "popular",
    coins: 150,
    price: 10,
    popular: true,
    bonus: "50% More Value",
    icon: <FiTrendingUp className="w-8 h-8" />,
    gradient: "from-purple-500 to-pink-500",
    savings: "Save $5",
  },
  {
    id: "professional",
    coins: 500,
    price: 20,
    bonus: "Best Value",
    icon: <FiStar className="w-8 h-8" />,
    gradient: "from-orange-500 to-red-500",
    savings: "Save $25",
  },
  {
    id: "enterprise",
    coins: 1000,
    price: 35,
    bonus: "Maximum Savings",
    icon: <FiAward className="w-8 h-8" />,
    gradient: "from-green-500 to-emerald-500",
    savings: "Save $65",
  },
];

const CheckoutForm = ({ selectedPackage, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

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
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: "John Doe", // In real app, get from user context
          email: "john@example.com",
        },
      });

      if (error) {
        setPaymentError(error.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      // Simulate API call to your backend
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.price * 100, // Convert to cents
          currency: "usd",
          payment_method_id: paymentMethod.id,
          coins: selectedPackage.coins,
        }),
      });

      const paymentIntent = await response.json();

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentIntent.client_secret
      );

      if (confirmError) {
        setPaymentError(confirmError.message || "Payment failed");
      } else {
        onSuccess();
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
        color: "#424770",
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
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

const PurchaseCoins = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Mock user data
  const [currentUser, setCurrentUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    coins: 250,
  });

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPackage) {
      setCurrentUser((prev) => ({
        ...prev,
        coins: prev.coins + selectedPackage.coins,
      }));

      const paymentInfo = {
        user_id: currentUser.id,
        package_id: selectedPackage.id,
        coins_purchased: selectedPackage.coins,
        amount_paid: selectedPackage.price,
        payment_date: new Date().toISOString(),
        status: "completed",
      };

      console.log("Payment successful:", paymentInfo);
      alert(
        `Payment successful! ${selectedPackage.coins} coins added to your account.`
      );
    }

    setShowCheckout(false);
    setSelectedPackage(null);
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className={isDarkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </div>

          <div className="relative z-10 min-h-screen p-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8 pt-8">
                <div></div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg"
                >
                  {isDarkMode ? (
                    <FiSun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <FiMoon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Purchase Coins
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  Choose the perfect coin package for your needs
                </p>

                {/* Current Balance */}
                <div className="inline-flex items-center space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Balance:
                  </span>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
                    <span className="text-lg font-bold">
                      {currentUser.coins}
                    </span>
                    <span className="text-sm">coins</span>
                  </div>
                </div>
              </div>

              {/* Coin Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                      pkg.popular
                        ? "ring-2 ring-purple-500 ring-opacity-50"
                        : ""
                    }`}
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        POPULAR
                      </div>
                    )}

                    {/* Card Header */}
                    <div
                      className={`bg-gradient-to-r ${pkg.gradient} p-6 text-white`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        {pkg.icon}
                        {pkg.bonus && (
                          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            {pkg.bonus}
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-bold mb-1">{pkg.coins}</div>
                      <div className="text-sm opacity-90">Coins</div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          ${pkg.price}
                        </div>
                        {pkg.savings && (
                          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {pkg.savings}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                          Instant delivery
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                          Secure payment
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                          24/7 support
                        </div>
                      </div>

                      <button
                        className={`w-full bg-gradient-to-r ${pkg.gradient} hover:opacity-90 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg`}
                      >
                        Purchase Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security & Trust */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Secure & Trusted Payment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your payment information is protected with industry-standard
                    encryption
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      SSL Encrypted
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All transactions are secured with 256-bit SSL encryption
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Stripe Powered
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payments processed by Stripe, trusted by millions
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Instant Delivery
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Coins are added to your account immediately after payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Modal */}
          {showCheckout && selectedPackage && (
            <CheckoutForm
              selectedPackage={selectedPackage}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}
        </div>
      </div>
    </Elements>
  );
};

export default PurchaseCoins;
