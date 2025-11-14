import {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import attachAuthToken from "./interceptors/request/attachAuthToken";
import handleErrors from "./interceptors/response/handleErrors";
import retryRequest from "./interceptors/response/retryRequest";

export default function setupInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {

      if (!config.signal && typeof AbortController !== "undefined") {
        const controller = new AbortController();
        config.signal = controller.signal;
        (config as any).abortController = controller;
      }

      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      return await attachAuthToken(config);
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      if (
        error.code === "ERR_CANCELED" ||
        (axiosInstance as any).isCancel?.(error)
      ) {
        console.warn("Axios isteği iptal edildi.");
        return Promise.reject(error);
      }

      handleErrors(error);
      return retryRequest(error, axiosInstance);
    }
  );
}
