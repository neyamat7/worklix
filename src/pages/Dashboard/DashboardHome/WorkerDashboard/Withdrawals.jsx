import {
  AlertCircle,
  ArrowRight,
  Coins,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCreateWithdrawal } from "../../../../hooks/useRequestWithdrawal";
import { useSingleUserData } from "../../../../hooks/useUserData";

export default function Withdrawal() {
  const [coinsToWithdraw, setCoinsToWithdraw] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const { data: workerData, isLoading } = useSingleUserData(user?.email);

  const withdrawMutation = useCreateWithdrawal();

  const paymentSystems = [
    { value: "bkash", label: "bKash" },
    { value: "rocket", label: "Rocket" },
    { value: "nagad", label: "Nagad" },
    { value: "bank", label: "Bank Transfer" },
    { value: "paypal", label: "PayPal" },
  ];

  useEffect(() => {
    setWithdrawalAmount(coinsToWithdraw / conversionRate);
  }, [coinsToWithdraw]);

  const minWithdrawalCoins = 200;
  const conversionRate = 20;
  const currentDollarValue = workerData?.coins / conversionRate;
  const canWithdraw = workerData?.coins >= minWithdrawalCoins;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleCoinsChange = (value) => {
    if (value <= workerData.coins && value >= 0) {
      setCoinsToWithdraw(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWithdraw || coinsToWithdraw < minWithdrawalCoins) return;

    setIsSubmitting(true);

    const withdrawalData = {
      worker_email: workerData.email,
      worker_name: workerData.name,
      withdrawal_coin: coinsToWithdraw,
      withdrawal_amount: withdrawalAmount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: "pending",
    };

    // save withdrawal data to the database
    withdrawMutation.mutate(withdrawalData, { userId: workerData._id });

    setCoinsToWithdraw(0);
    setWithdrawalAmount(0);
    setPaymentSystem("");
    setAccountNumber("");
    setIsSubmitting(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-purple-500 dark:to-pink-500 rounded-full mb-6 shadow-2xl">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-500 to-gray-400 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
            Withdrawal Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Convert your earned coins into real money and withdraw to your
            preferred payment method
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Current Balance Card */}
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Current Balance
              </h2>
              <TrendingUp className="w-8 h-8 text-gray-500 dark:text-green-300" />
            </div>

            <div className="space-y-6">
              {/* Coins Display */}
              <div className="bg-gradient-to-r from-gray-200/60 to-gray-400/40 dark:from-yellow-800/30 dark:to-orange-800/30 rounded-2xl p-6 border border-gray-300 dark:border-yellow-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-yellow-400 dark:to-orange-400 rounded-full flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Total Coins
                      </p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-yellow-200">
                        {workerData?.coins.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dollar Value Display */}
              <div className="bg-gradient-to-r from-gray-200/60 to-gray-400/40 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl p-6 border border-gray-300 dark:border-green-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-green-400 dark:to-emerald-400 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Withdrawal Value
                      </p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-green-200">
                        ${currentDollarValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimum Withdrawal Info */}
              <div className="bg-gray-200/60 dark:bg-blue-900/30 rounded-2xl p-4 border border-gray-300 dark:border-blue-800/40">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-500 dark:text-blue-300" />
                  <p className="text-gray-700 dark:text-blue-300 text-sm">
                    Minimum withdrawal: 200 coins ($10.00)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Withdraw Funds
              </h2>
              <CreditCard className="w-8 h-8 text-gray-500 dark:text-purple-300" />
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Coins to Withdraw */}
              <div>
                <label className="block text-gray-800 dark:text-gray-100 text-sm font-medium mb-2">
                  Coins to Withdraw *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={coinsToWithdraw}
                    onChange={(e) => handleCoinsChange(Number(e.target.value))}
                    min={minWithdrawalCoins}
                    max={workerData?.coins}
                    className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter coins to withdraw"
                    required
                  />
                  <Coins className="absolute right-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                  Maximum: {workerData?.coins.toLocaleString()} coins
                </p>
              </div>

              {/* Withdrawal Amount (Auto-calculated) */}
              <div>
                <label className="block text-gray-800 dark:text-gray-100 text-sm font-medium mb-2">
                  Withdrawal Amount ($) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawalAmount.toFixed(2)}
                    readOnly
                    className="w-full bg-gray-200 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                  <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                  Auto-calculated (20 coins = $1.00)
                </p>
              </div>

              {/* Payment System */}
              <div>
                <label className="block text-gray-800 dark:text-gray-100 text-sm font-medium mb-2">
                  Select Payment System *
                </label>
                <select
                  value={paymentSystem}
                  onChange={(e) => setPaymentSystem(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-100 dark:bg-gray-900">
                    Select payment method
                  </option>
                  {paymentSystems.map((system) => (
                    <option
                      key={system.value}
                      value={system.value}
                      className="bg-gray-100 dark:bg-gray-900"
                    >
                      {system.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-gray-800 dark:text-gray-100 text-sm font-medium mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your account number"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || coinsToWithdraw < minWithdrawalCoins}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-700 dark:from-purple-500 dark:to-pink-500 hover:from-gray-600 hover:to-gray-800  disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:shadow-none flex items-center justify-center space-x-2
                disabled:cursor-not-allowed
                "
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {canWithdraw ? (
                      <>
                        <span>
                          {" "}
                          {withdrawMutation.isPending
                            ? "Processing..."
                            : "Withdraw Funds"}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span className="disabled:cursor-not-allowed">
                          Insufficient Coin
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Conversion Rate Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-gray-500 dark:text-yellow-300" />
                <span>20 Coins</span>
              </div>
              <span>=</span>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-500 dark:text-green-300" />
                <span>$1.00 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
