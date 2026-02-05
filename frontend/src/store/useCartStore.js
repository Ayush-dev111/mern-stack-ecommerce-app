import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const AUTO_COUPON_THRESHOLD = 200; // $200 threshold for auto coupon

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  isAutoCoupon: false,
  autoCouponMessage: "",

  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  // Check and auto-apply coupon based on cart total
  checkAndApplyAutoCoupon: async () => {
    try {
      const response = await axiosInstance.post("/coupons/auto-generate");
      const { coupon, autoApplied, message } = response.data;

      const currentState = get();

      if (autoApplied && coupon) {
        // Auto coupon is available and should be applied
        if (
          !currentState.isCouponApplied ||
          currentState.coupon?.code !== coupon.code
        ) {
          // Calculate the new total with the auto coupon
          const discount =
            currentState.subtotal * (coupon.discountPercentage / 100);
          const newTotal = currentState.subtotal - discount;

          set({
            coupon,
            isCouponApplied: true,
            isAutoCoupon: true,
            autoCouponMessage: message,
            total: newTotal,
          });
          toast.success(
            `🎉 ${coupon.discountPercentage}% discount auto-applied! Cart total is over $${AUTO_COUPON_THRESHOLD}`,
          );
        }
      } else {
        // No auto coupon available (below threshold)
        if (currentState.isAutoCoupon && currentState.isCouponApplied) {
          // Remove auto coupon since we're below threshold
          // Reset total to subtotal since coupon is removed
          set({
            coupon: null,
            isCouponApplied: false,
            isAutoCoupon: false,
            autoCouponMessage: message,
            total: currentState.subtotal,
          });
          toast.info(
            `Discount removed - cart total is below $${AUTO_COUPON_THRESHOLD}`,
          );
        } else {
          set({ autoCouponMessage: message });
        }
      }
    } catch (error) {
      console.error("Error checking auto coupon:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({
        coupon: response.data,
        isCouponApplied: true,
        isAutoCoupon: false,
      });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: async () => {
    try {
      await axiosInstance.delete("/coupons");
      set({ coupon: null, isCouponApplied: false, isAutoCoupon: false });
      get().calculateTotals();
      toast.success("Coupon removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove coupon");
    }
  },

  // Generate coupon when user clicks the button (cart total >= $200)
  generateCoupon: async () => {
    try {
      const currentState = get();
      if (currentState.subtotal < 200) {
        toast.error("Cart total must be at least $200 to generate a coupon");
        return;
      }

      const response = await axiosInstance.post("/coupons/auto-generate");
      const { coupon, autoApplied, message } = response.data;

      if (coupon) {
        // Calculate the new total with the coupon
        const discount =
          currentState.subtotal * (coupon.discountPercentage / 100);
        const newTotal = currentState.subtotal - discount;

        set({
          coupon,
          isCouponApplied: true,
          isAutoCoupon: false,
          total: newTotal,
        });
        toast.success(`🎉 ${coupon.discountPercentage}% coupon applied!`);
      } else {
        toast.error(message || "Could not generate coupon");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate coupon");
    }
  },

  getCartItems: async () => {
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  clearCart: async () => {
    try {
      await axiosInstance.delete("/cart/all");
      set({
        cart: [],
        coupon: null,
        total: 0,
        subtotal: 0,
        isCouponApplied: false,
        isAutoCoupon: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/cart`, { data: { productId } });
      set((prev) => ({
        cart: prev.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axiosInstance.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item,
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  calculateTotals: () => {
    const { cart, coupon, isCouponApplied } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (coupon && isCouponApplied) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
