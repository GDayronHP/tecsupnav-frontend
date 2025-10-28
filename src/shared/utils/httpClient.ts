import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

let cachedToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiBaseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = async (): Promise<string | null> => {
  if (cachedToken) {
    return cachedToken;
  }

  if (tokenPromise) {
    return await tokenPromise;
  }

  tokenPromise = SecureStore.getItemAsync("access_token");

  try {
    cachedToken = await tokenPromise;
    return cachedToken;
  } catch (error) {
    console.error("Error obteniendo access token:", error);
    return null;
  } finally {
    tokenPromise = null;
  }
};

export const clearTokenCache = () => {
  cachedToken = null;
  tokenPromise = null;
};

export const updateTokenCache = (newToken: string) => {
  cachedToken = newToken;
};

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearTokenCache();

      console.warn("Token expirado. Limpiando cache.");
    }
    return Promise.reject(error);
  }
);

function handleAxiosError(error: any, endpoint: string): never {
  const axiosError = error as AxiosError<{ message?: string }>;
  console.error(`❌ Error fetching ${endpoint}:`, axiosError);

  const message =
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Ocurrió un error inesperado al comunicarse con el servidor.";

  throw new Error(message);
}
  

export const httpGet = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error, endpoint);
  }
};

export const httpPost = async <T>(
  endpoint: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, body, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error, endpoint);
  }
};

export const httpPut = async <T>(
  endpoint: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.put<T>(endpoint, body, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error, endpoint);
  }
};

export const httpDelete = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.delete<T>(endpoint, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error, endpoint);
  }
};

export default api;
