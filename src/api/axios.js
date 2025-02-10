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

// Modify the response interceptor to not redirect for public routes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't show toast or redirect for public routes
    const publicRoutes = ['/courses', '/courses/'];
    const isPublicRoute = publicRoutes.some(route => 
      originalRequest.url.startsWith(route)
    );

    // Don't show toast for refresh token or auth check endpoints
    const isAuthEndpoint =
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/me");

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isAuthEndpoint && !isPublicRoute) {
        originalRequest._retry = true;
        try {
          await api.post("/auth/refresh-token");
          return api(originalRequest);
        } catch (refreshError) {
          if (!window.location.pathname.startsWith("/auth/") && !isPublicRoute) {
            window.location.href = "/auth/login";
          }
          return Promise.reject(refreshError);
        }
      }
    } else if (!isAuthEndpoint && !isPublicRoute) {
      // Show toast for all other errors except auth endpoints and public routes
      showErrorToast(error);
    }

    return Promise.reject(error);
  }
);
