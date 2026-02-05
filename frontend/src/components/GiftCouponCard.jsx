import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { Gift, Sparkles, Ticket, Loader } from "lucide-react";
import { toast } from "react-hot-toast";

const COUPON_THRESHOLD = 200;
const DISCOUNT_PERCENTAGE = 10;

const GiftCouponCard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { coupon, isCouponApplied, removeCoupon, generateCoupon, subtotal } =
    useCartStore();

  const isEligible = subtotal >= COUPON_THRESHOLD;
  const amountNeeded = COUPON_THRESHOLD - subtotal;

  const handleGenerateCoupon = async () => {
    if (!isEligible) return;
    setIsGenerating(true);
    try {
      await generateCoupon();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Gift Coupon</h3>
      </div>

      {/* Coupon Applied State */}
      {isCouponApplied && coupon ? (
        <motion.div
          className="rounded-lg bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-lg font-semibold text-green-400">
              🎉 Coupon Applied!
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3">
              <Ticket className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-white font-mono font-bold text-lg tracking-wider">
                  {coupon.code}
                </p>
                <p className="text-sm text-gray-400">
                  {coupon.discountPercentage}% discount applied
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">
                -{coupon.discountPercentage}%
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            className="flex w-full items-center justify-center rounded-lg bg-red-600/80 
              px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 
              focus:outline-none focus:ring-4 focus:ring-red-300/30 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Progress Indicator */}
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isEligible
                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                      : "bg-gradient-to-r from-blue-600 to-blue-400"
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((subtotal / COUPON_THRESHOLD) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              {/* Threshold Marker */}
              <div className="absolute right-0 -top-1 flex flex-col items-center">
                <div
                  className={`w-1 h-5 rounded-full ${
                    isEligible ? "bg-green-400" : "bg-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Status Text */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                ${subtotal.toFixed(2)} / ${COUPON_THRESHOLD}
              </span>
              {isEligible ? (
                <span className="text-green-400 font-medium flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Eligible for {DISCOUNT_PERCENTAGE}% off!
                </span>
              ) : (
                <span className="text-gray-400">
                  Add{" "}
                  <span className="text-blue-400 font-semibold">
                    ${amountNeeded.toFixed(2)}
                  </span>{" "}
                  more
                </span>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            type="button"
            disabled={!isEligible || isGenerating}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 
              text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4
              ${
                isEligible
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 focus:ring-blue-300/30 cursor-pointer"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            whileHover={isEligible ? { scale: 1.02 } : {}}
            whileTap={isEligible ? { scale: 0.98 } : {}}
            onClick={handleGenerateCoupon}
          >
            {isGenerating ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Gift className="h-5 w-5" />
                Generate Your Coupon
              </>
            )}
          </motion.button>

          {/* Info Text */}
          {!isEligible && (
            <p className="text-center text-xs text-gray-500">
              Spend ${COUPON_THRESHOLD} or more to unlock a{" "}
              {DISCOUNT_PERCENTAGE}% discount coupon
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
