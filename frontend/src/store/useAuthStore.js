import { create } from 'zustand';
import {toast} from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js'

export const useAuthStore = create((set) => ({
    user: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLogingUp: false,
    checkingAuth: false,

    signup : async ({fullName, email, password}) => {
        set({isSigningUp: true})
        try {
            const response = await axiosInstance.post("/auth/signup", {fullName, email, password});
            set({user: response.data});
            toast.success("User signup successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ isSigningUp: false });
        }

    },

    login : async (email, password) => {
        set({isLogingUp : true});
        try {
            const response = await axiosInstance.post("auth/login", {email, password});
            set({user: response.data});
            toast.success("User logged in successfully");
        } catch (error) {
             toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ isLogingUp: false });
        }
    },

    logout : async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({user: null});
            toast.success("Logout successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    checkAuth : async () => {
        set({checkingAuth : true})
        try {
            const response = await axiosInstance.get("/auth/profile");
            set({user: response.data});

        } catch (error) {
            set({user: null})
        }finally {
            set({ checkingAuth: false });
        }
    },
}));