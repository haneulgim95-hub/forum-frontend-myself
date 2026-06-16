import axios, { isAxiosError } from "axios";
import { useAuthStore } from "../stores/auth/authStore.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: true,
});

export default api;

api.interceptors.request.use(config => {
    const { token } = useAuthStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                useAuthStore.getState().logout();
                alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
                window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    },
);
