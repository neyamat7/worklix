import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import {
  FiAward,
  FiCheck,
  FiCreditCard,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import useAuth from "../../../../../context/AuthContext";
import { useRecordPayment } from "../../../../../hooks/useRecordPayment";
import { useSingleUserData } from "../../../../../hooks/useUserData";
import CheckoutForm from "./CheckoutForm";

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

const PurchaseCoins = () => {
  const { mutate: recordPayment, isLoading: recordPaymentLoading } =
    useRecordPayment();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { user: authUser } = useAuth();
  const { data: user, isLoading, error } = useSingleUserData(authUser?.email);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (paymentIntent, selectedPackage) => {
    // save payment info and update user coins

    if ((paymentIntent, selectedPackage)) {
      // update user coins and save payment info
      const paymentInfo = {
        user_email: authUser?.email,
        package_id: selectedPackage.id,
        coins_purchased: selectedPackage.coins,
        amount_paid: paymentIntent.amount,
        currency: paymentIntent.currency,
        payment_date: new Date().toISOString(),
        status: paymentIntent.status,
        payment_intent_id: paymentIntent.id,
        payment_method_id: paymentIntent.payment_method,
        payment_method_types: paymentIntent.payment_method_types,
      };

      recordPayment(paymentInfo);
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
      <div>
        <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Decorative background elements */}
          {/* <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </div> */}

          <div className="relative z-10 h-full p-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
              {/* <div className="flex justify-between items-center mb-8 pt-8">
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
              </div> */}

              <div className="text-center my-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Purchase Coins
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  Choose the perfect coin package for your needs
                </p>

                {/* Current Balance */}
                <div className="inline-flex items-center space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Your Current Balance:
                  </span>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-md">
                    <span className="text-lg font-bold">{user?.coins}</span>
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
