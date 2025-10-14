import axiosClient from "@/lib/axios";
import {BrandPayload} from "@/types";

export const brandService = {
    getAll: async () => {
        const res = await axiosClient.get("/brand");
        return res.data;
    },

    getOne: async (id: number) => {
        const res = await axiosClient.get(`/brand/${id}`);
        return res.data;
    },

    create: async (data: BrandPayload) => {
        const res = await axiosClient.post("/brand", data);
        return res.data;
    },

    update: async (id: number, data: BrandPayload) => {
        const res = await axiosClient.put(`/brand/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosClient.delete(`/brand/${id}`);
        return res.data;
    }
}
