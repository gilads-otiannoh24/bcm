import axios, { AxiosError, AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for responses
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    //const message = err.message || "An unknown error occurred";

    const allowedRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/",
      "/browse",
      "/favourites",
      "/contact",
      "/terms",
      "/about",
      "/privacy",
    ];

    if (err.response) {
      if (
        err.response?.status === 401 &&
        !window.location.pathname.startsWith("/reset-password") &&
        !allowedRoutes.includes(window.location.pathname)
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
