import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

let cachedToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

const activeRequests = new Map<string, { timestamp: number; url?: string }>();

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // ✅ NUEVO: Configuración de conexiones
  maxRedirects: 3,
  maxContentLength: 50 * 1024 * 1024, 
  maxBodyLength: 50 * 1024 * 1024,
});

api.interceptors.request.use(
  async (config) => {
    const requestKey = `${config.method?.toUpperCase()}_${config.url}_${Date.now()}`;
    activeRequests.set(requestKey, {
      timestamp: Date.now(),
      url: config.url
    });

    (config as any).__requestKey = requestKey;

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

api.interceptors.response.use(
  (response) => {
    // ✅ Limpiar request activo
    const requestKey = (response.config as any).__requestKey;
    if (requestKey && activeRequests.has(requestKey)) {
      activeRequests.delete(requestKey);
    }
    return response;
  },
  async (error) => {
    // ✅ Limpiar request activo
    const requestKey = (error.config as any)?.__requestKey;
    if (requestKey && activeRequests.has(requestKey)) {
      activeRequests.delete(requestKey);
    }

    if (error.response?.status === 401) {
      clearTokenCache();
      console.warn("Token expirado. Limpiando cache.");
    }
    return Promise.reject(error);
  }
);

// ✅ NUEVO: Cleanup periódico con manejo de memoria
let cleanupInterval: any;

const startRequestMonitoring = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;

    // Limpiar requests que han estado activos por más de 2 minutos
    for (const [key, request] of activeRequests.entries()) {
      if (now - request.timestamp > 2 * 60 * 1000) {
        activeRequests.delete(key);
        cleanedCount++;
      }
    }

    console.log(`Active HTTP requests: ${activeRequests.size}`);
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} stale requests`);
    }
    if (activeRequests.size > 50) {
      console.warn('⚠️ Too many active requests, possible connection leak');
    }
  }, 30000);
};

const stopRequestMonitoring = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = undefined;
  }
  activeRequests.clear();
};

// ✅ Iniciar monitoreo
startRequestMonitoring();

// ✅ Exportar funciones de cleanup para uso manual si es necesario
export { startRequestMonitoring, stopRequestMonitoring };

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

function handleAxiosError(error: any, endpoint: string): never {
  const axiosError = error as AxiosError<{ message?: string }>;
  console.error(`❌ Error fetching ${endpoint}:`, axiosError);

  const message =
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Ocurrió un error inesperado al comunicarse con el servidor.";

  throw new Error(message);
}

// ✅ NUEVO: Wrapper con retry automático para errores de conexión
const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 2
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Solo retry en errores de red
      if (
        attempt < retries &&
        (axiosError.code === 'ECONNRESET' ||
         axiosError.code === 'ETIMEDOUT' ||
         axiosError.message?.includes('timeout') ||
         axiosError.message?.includes('Network Error'))
      ) {
        console.warn(`Request failed (attempt ${attempt}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
};

export const httpGet = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return executeWithRetry(async () => {
    const response = await api.get<T>(endpoint, config);
    return response.data;
  });
};

export const httpPost = async <T>(
  endpoint: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return executeWithRetry(async () => {
    const response = await api.post<T>(endpoint, body, config);
    return response.data;
  });
};

export const httpPut = async <T>(
  endpoint: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return executeWithRetry(async () => {
    const response = await api.put<T>(endpoint, body, config);
    return response.data;
  });
};

export const httpDelete = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return executeWithRetry(async () => {
    const response = await api.delete<T>(endpoint, config);
    return response.data;
  });
};

export default api;