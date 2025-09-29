import axios, { AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
const api = axios.create({
  
  baseURL: Constants.expoConfig?.extra?.apiBaseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const httpGet = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
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
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};
