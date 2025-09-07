import axios, { AxiosRequestConfig } from 'axios';

// GET generic function
export const httpGet = async <T>(baseURL: string, endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const url = `${baseURL}${endpoint}`;
    const response = await axios.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};
