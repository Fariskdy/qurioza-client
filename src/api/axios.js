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

// Define protected routes that should trigger token refresh
const protectedPaths = [
  "/dashboard",
  "/auth/me",
  "/auth/profile",
  "/auth/change-password",
];

const isProtectedRoute = (url) => {
  return protectedPaths.some((path) => url.includes(path));
};

// Simplified response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for protected routes
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      isProtectedRoute(originalRequest.url) &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        // Only redirect if on a protected route
        if (isProtectedRoute(window.location.pathname)) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
