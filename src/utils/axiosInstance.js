import axios from "axios";
import { BASE_URL } from "./apiPaths"

// =====================================
// 🌐 Axios Instance Configuration
// =====================================
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Maximum wait time for a request (10 seconds)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =====================================
// 🔹 Request Interceptor
// =====================================
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors globally
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

// =====================================
// 🔹 Response Interceptor
// =====================================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle known response errors globally
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          console.warn("⚠️ Unauthorized. Redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;

        case 403:
          console.error("🚫 Access denied. You don’t have permission.");
          break;

        case 500:
          console.error("💥 Internal server error. Please try again later.");
          break;

        default:
          console.error(
            `❗ Unexpected error (Status: ${status}) —`,
            error.response.data?.message || "Unknown error occurred."
          );
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timed out. Please try again later.");
    } else {
      console.error("🌐 Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
