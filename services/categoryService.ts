import axiosClient from "@/lib/axios";
import {CategoryPayload} from "@/types";

export const categoryService = {
    getAll: async () => {
        const res = await axiosClient.get("/category");
        return res.data;
    },

    create: async (data: CategoryPayload) => {
        const res = await axiosClient.post("/category", data);
        return res.data;
    },

    update: async (id: number, data: CategoryPayload) => {
        const res = await axiosClient.put(`/category/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosClient.delete(`/category/${id}`);
        return res.data;
    }
}
