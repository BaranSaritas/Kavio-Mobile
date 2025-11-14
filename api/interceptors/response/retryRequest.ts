import { AxiosInstance, AxiosError } from 'axios';

const MAX_RETRIES = 2;

export default async function retryRequest(
  error: AxiosError,
  axiosInstance: AxiosInstance
): Promise<any> {
  const config: any = error.config;
  
  if (!config || config.__isRetryRequest) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= MAX_RETRIES) {
    return Promise.reject(error);
  }

  config.__retryCount += 1;
  config.__isRetryRequest = true;

  console.log(`Retrying request (${config.__retryCount}/${MAX_RETRIES})...`);
  
  return new Promise((resolve) => setTimeout(() => resolve(null), 2500)).then(() =>
    axiosInstance(config)
  );
}
