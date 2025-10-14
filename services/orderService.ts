import axiosClient from "@/lib/axios";
import {CreateOrderPayload} from "@/types";

export const orderService = {
    getOrder: async () => {
        const res = await axiosClient.get("/order")
        return res.data;
    },

    create: async (payload: CreateOrderPayload) => {
        const res = await axiosClient.post("/order", payload);
        return res.data;
    },
}