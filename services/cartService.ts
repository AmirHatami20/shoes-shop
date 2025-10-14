import axiosClient from "@/lib/axios";
import {CartItemPayload} from "@/types";

export const cartService = {
    addItem: async (payload: CartItemPayload) => {
        const res = await axiosClient.post("/cart", payload);
        return res.data;
    },

    getCart: async () => {
        const res = await axiosClient.get("/cart");
        return res.data;
    },

    removeItem: async (itemId: number) => {
        const res = await axiosClient.delete(`/cart/${itemId}`);
        return res.data;
    },

    updateItem: async (itemId: number, qty: number) => {
        const res = await axiosClient.put(`/cart/${itemId}`, {qty});
        return res.data;
    },
};
