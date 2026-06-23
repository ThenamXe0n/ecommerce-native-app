import { authStorage } from "@/features/auth/storage/auth.storage";
import { useAuthStore } from "@/features/auth/store/auth.store";
import axios, { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log("REQUEST");
    console.log(config.method);
    console.log(config.url);
    console.log(config.headers);

    return config;
  },
  (error) => {
    console.log("ERROR");
    console.log(error.response?.status);
    console.log(error.response?.data);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("RESPONSE");
    console.log(response.status);
    console.log(response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await authStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("Refresh token missing");
        }
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );
        const newAccessToken = response.data.data.accessToken;

        useAuthStore.getState().updateAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await authStorage.removeTokens();
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
