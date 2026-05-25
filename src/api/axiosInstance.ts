import axios from "axios";
import { useAuthStore } from "../stores/auth/authStore.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: true,
});

export default api;

api.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
