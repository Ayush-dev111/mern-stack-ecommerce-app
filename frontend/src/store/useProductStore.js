import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(
        "/products/create-product",
        productData,
      );
      set((prevState) => ({
        products: [...prevState.products, res.data],
        isLoading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ isLoading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/products/category/${category}`,
      );
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to update product");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/products/featured");
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
