import {ProductQueryParams} from "@/types";
import axiosClient from "@/lib/axios";

export const productService = {
    getAll: async (params?: ProductQueryParams) => {
        const res = await axiosClient.get('/product', {params: params ?? {}});
        return res.data;
    },


    getOne: async (id: number) => {
        const res = await axiosClient.get(`/product/${id}`);
        return res.data;
    },

    create: async (formData: FormData) => {
        const res = await axiosClient.post("/product", formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return res.data;
    },

    update: async (id: number, formData: FormData) => {
        const res = await axiosClient.put(`/product/${id}`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosClient.delete(`/product/${id}`);
        return res.data;
    }
}
