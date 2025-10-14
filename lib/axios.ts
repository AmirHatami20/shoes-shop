import axios from "axios";

const isServer = typeof window === "undefined";

const API_URL = !isServer
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api`
        : "http://localhost:3000/api";

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export default axiosClient;
