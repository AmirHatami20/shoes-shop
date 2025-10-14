import {LoginData, RegisterData} from "@/types";
import axiosClient from "@/lib/axios";

export const authService = {
    register: async (data: RegisterData) => {
        const res = await axiosClient.post("/auth/register", data);
        return res.data;
    },

    login: async (data: LoginData) => {
        const res = await axiosClient.post("/auth/login", data);
        return res.data;
    },

    getMe: async () => {
        const res = await axiosClient.get(`/auth/me`);
        return res.data;
    },
    logout: async () => {
        await axiosClient.post("/auth/logout");
    }
};
