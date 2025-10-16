import {LoginData, RegisterData} from "@/types";
import axiosClient, {API_URL} from "@/lib/axios";

export const authService = {
    register: async (data: RegisterData) => {
        const res = await axiosClient.post("/auth/register", data);
        return res.data;
    },

    login: async (data: LoginData) => {
        const res = await axiosClient.post("/auth/login", data);
        return res.data;
    },

    getMe: async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: {cookie: `access_token=${token}`}
            });
            return res.json();
        } catch (err) {
            console.error("Error fetching user in layout:", err);
        }
    },

    logout: async () => {
        await axiosClient.post("/auth/logout");
    }
};
