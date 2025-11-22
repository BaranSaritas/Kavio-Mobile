import axios from "axios";
import setupInterceptors from "./setupInterceptors";

const baseURL ="http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// 1) ÖNCE token / error handler
// =============================
setupInterceptors(axiosInstance);

// =============================
// LOGGING FUNCTIONS
// =============================
const logRequest = (config: any) => {
  console.log("===== REQUEST =====");
  console.log("URL:", config.baseURL + config.url);
  console.log("METHOD:", config.method?.toUpperCase());
  console.log("HEADERS:", config.headers);
  console.log("BODY:", config.data);
  console.log("===================");
  return config;
};

const logResponse = (response: any) => {
  console.log("===== RESPONSE =====");
  console.log("URL:", response.config.url);
  console.log("STATUS:", response.status);
  console.log("DATA:", response.data);
  console.log("====================");
  return response;
};

const logError = (error: any) => {
  console.log("===== ERROR =====");
  console.log("URL:", error.config?.url);
  console.log("STATUS:", error.response?.status);
  console.log("MESSAGE:", error.message);
  console.log("DATA:", error.response?.data);
  console.log("=================");
  return Promise.reject(error);
};

// =============================
// 2) EN SONA LOG INTERCEPTORS
// =============================
axiosInstance.interceptors.request.use(logRequest, logError);
axiosInstance.interceptors.response.use(logResponse, logError);

export default axiosInstance;
