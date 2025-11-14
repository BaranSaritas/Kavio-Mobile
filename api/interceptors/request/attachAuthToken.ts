// interceptors/request/attachAuthToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

export default async function attachAuthToken(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {

  const token = await AsyncStorage.getItem("accessToken");

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
}
