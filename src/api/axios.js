import axios from "axios";
import { showErrorToast } from "@/lib/toast-utils";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookie-based auth
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't show toast for refresh token or auth check endpoints
    const isAuthEndpoint =
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/me");

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isAuthEndpoint) {
        originalRequest._retry = true;
        try {
          await api.post("/auth/refresh-token");
          return api(originalRequest);
        } catch (refreshError) {
          // Only redirect to login if refresh token fails
          if (!window.location.pathname.startsWith("/auth/")) {
            window.location.href = "/auth/login";
          }
          return Promise.reject(refreshError);
        }
      }
    } else if (!isAuthEndpoint && error.response) {
      // Only show toast for response errors
      showErrorToast(error);
    }

    return Promise.reject(error);
  }
);
