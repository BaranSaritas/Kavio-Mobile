import axios from "axios";
import setupInterceptors from "./setupInterceptors";

// Expo'da environment variable'lar
const baseURL ="http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(axiosInstance);

export default axiosInstance;
