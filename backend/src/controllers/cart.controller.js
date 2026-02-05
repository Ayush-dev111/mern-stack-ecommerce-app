import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.productId?.toString() === productId,
    );

    if (existingItemIndex > -1) {
      user.cartItems[existingItemIndex].quantity += 1;
    } else {
      user.cartItems.push({ productId, quantity: 1 });
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cartItems = user.cartItems.filter((item) => {
      const id = item.productId?.toString() || item._id?.toString();
      return id !== productId;
    });
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.user._id },
      { $set: { cartItems: [] } },
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "All items removed", cart: [] });
  } catch (error) {
    console.error("Error in removeAllFromCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;

    const user = req.user;
    const existingItem = user.cartItems.find(
      (item) => item.productId?.toString() === productId,
    );

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.productId?.toString() !== productId,
        );
      } else {
        existingItem.quantity = quantity;
      }
      await user.save(); // save in both cases
      return res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("error in updateQuantity controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error:", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    // Extract product IDs from cart items
    const productIds = req.user.cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.productId?.toString() === product._id.toString(),
      );
      return { ...product.toJSON(), quantity: item?.quantity || 1 };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("error in getCartProducts controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error:", error: error.message });
  }
};
