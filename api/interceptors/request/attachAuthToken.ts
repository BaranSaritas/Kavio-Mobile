// interceptors/request/attachAuthToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

export default async function attachAuthToken(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  // Other profile management API'leri için token gönderme (public API'ler)
  if (config.url?.includes('/other-profile-management/')) {
    return config;
  }

  const token = await AsyncStorage.getItem("accessToken");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
}
