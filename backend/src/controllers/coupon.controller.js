import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";

// Generate auto coupon when cart total >= $200
export const generateAutoCoupon = async (req, res) => {
  try {
    const user = req.user;

    // Calculate cart total from user's cart items
    const productIds = user.cartItems.map((item) => item.productId || item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    let cartTotal = 0;
    products.forEach((product) => {
      const cartItem = user.cartItems.find(
        (item) =>
          (item.productId?.toString() || item._id?.toString()) ===
          product._id.toString(),
      );
      if (cartItem) {
        cartTotal += product.price * (cartItem.quantity || 1);
      }
    });

    const MINIMUM_AMOUNT = 200;
    const DISCOUNT_PERCENTAGE = 10;

    // Check if total is above $200
    if (cartTotal >= MINIMUM_AMOUNT) {
      // Check if user already has an active coupon (auto or manual)
      let existingCoupon = await Coupon.findOne({
        userId: user._id,
        isActive: true,
      });

      if (existingCoupon) {
        // Return existing coupon
        return res.json({
          coupon: existingCoupon,
          autoApplied: true,
          message: "Coupon already exists",
        });
      }

      // Delete any existing coupons for this user first (because userId is unique)
      await Coupon.deleteMany({ userId: user._id });

      // Generate new coupon
      const couponCode = `GIFT-${user._id.toString().slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      const newCoupon = new Coupon({
        code: couponCode,
        discountPercentage: DISCOUNT_PERCENTAGE,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days validity
        isActive: true,
        userId: user._id,
      });

      await newCoupon.save();

      return res.json({
        coupon: newCoupon,
        autoApplied: true,
        message: "Coupon generated successfully",
      });
    } else {
      // Cart total is below $200 - just return null, don't delete any coupons
      return res.json({
        coupon: null,
        autoApplied: false,
        message:
          cartTotal > 0
            ? `Add $${(MINIMUM_AMOUNT - cartTotal).toFixed(2)} more to get a ${DISCOUNT_PERCENTAGE}% discount!`
            : "Cart is empty",
      });
    }
  } catch (error) {
    console.log("Error in generateAutoCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.deleteMany({ userId: req.user._id });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
