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
    const isAuthEndpoint = originalRequest.url.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        await api.post('/auth/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        if (!window.location.pathname.startsWith('/auth/')) {
          // Add timeout to prevent race conditions
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 100);
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
