import axios from "axios";
import setupInterceptors from "./setupInterceptors";
import Constants from "expo-constants";

// Expo'da environment variable'lar
const baseURL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(axiosInstance);

export default axiosInstance;
