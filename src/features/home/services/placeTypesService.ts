import { PlaceTypesResponseV1 } from '@types/placeType_response_v1';
import { httpGet } from '@utils/httpClient';

// Types y interfaces
export interface PlaceType {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    lugares: number;
  };
}

export interface CreatePlaceTypeDto {
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  activo?: boolean;
}

export interface UpdatePlaceTypeDto {
  nombre?: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  activo?: boolean;
}

export interface PlaceTypeStats {
  total: number;
  active: number;
  inactive: number;
  mostUsed: Array<{
    id: string;
    nombre: string;
    count: number;
  }>;
  leastUsed: Array<{
    id: string;
    nombre: string;
    count: number;
  }>;
  recentlyCreated: PlaceType[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  statusCode?: number;
}

class PlaceTypesService {
  private baseURL: string;

  constructor(baseURL: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    // this.setupInterceptors();
  }

  async getAll(): Promise<PlaceType[]> {
    const data = await httpGet<PlaceTypesResponseV1>(this.baseURL,'/place-types');
    return data.data;
  }


  // private createAxiosInstance(): AxiosInstance {
  //   return axios.create({
  //     baseURL: this.baseURL,
  //     timeout: 10000,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // }

  // private setupInterceptors(): void {
  //   // Request interceptor - añade token JWT automáticamente
  //   this.api.interceptors.request.use(
  //     async (config) => {
  //       try {
  //         const token = await AsyncStorage.getItem('jwt_token');
  //         if (token) {
  //           config.headers.Authorization = `Bearer ${token}`;
  //         }
  //       } catch (error) {
  //         console.warn('Error getting token from storage:', error);
  //       }
  //       return config;
  //     },
  //     (error) => {
  //       return Promise.reject(error);
  //     }
  //   );

  //   // Response interceptor - maneja errores globalmente
  //   this.api.interceptors.response.use(
  //     (response: AxiosResponse) => response,
  //     async (error) => {
  //       if (error.response?.status === 401) {
  //         // Token expirado, limpiar storage
  //         await AsyncStorage.removeItem('jwt_token');
  //         console.warn('Token expired, user needs to login again');
  //       }
  //       return Promise.reject(error);
  //     }
  //   );
  // }

  // // Método auxiliar para manejar respuestas de la API
  // private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  //   const { data } = response;
  //   if (!data.success) {
  //     throw new Error(data.message || 'Error en la petición');
  //   }
  //   return data.data!;
  // }

  // // Método auxiliar para manejar errores
  // private handleError(error: any): never {
  //   if (error.response?.data?.message) {
  //     throw new Error(error.response.data.message);
  //   }
  //   if (error.message) {
  //     throw new Error(error.message);
  //   }
  //   throw new Error('Error de conexión');
  // }

  // // CREAR TIPO DE LUGAR (Solo Admin)
  // async createPlaceType(data: CreatePlaceTypeDto): Promise<PlaceType> {
  //   try {
  //     const response = await this.api.post<ApiResponse<PlaceType>>(
  //       '/place-types',
  //       data
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // OBTENER TODOS LOS TIPOS DE LUGAR
  // async getAllPlaceTypes(): Promise<PlaceType[]> {
  //   try {
  //     const response = await this.api.get<ApiResponse<PlaceType[]>>(
  //       '/place-types'
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // OBTENER SOLO TIPOS ACTIVOS
  // async getActivePlaceTypes(): Promise<PlaceType[]> {
  //   try {
  //     const allTypes = await this.getAllPlaceTypes();
  //     return allTypes.filter(type => type.activo);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // OBTENER ESTADÍSTICAS (Solo Admin)
  // async getPlaceTypesStats(): Promise<PlaceTypeStats> {
  //   try {
  //     const response = await this.api.get<ApiResponse<PlaceTypeStats>>(
  //       '/place-types/stats'
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // OBTENER TIPO DE LUGAR POR ID
  // async getPlaceTypeById(id: string): Promise<PlaceType> {
  //   try {
  //     const response = await this.api.get<ApiResponse<PlaceType>>(
  //       `/place-types/${id}`
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // ACTUALIZAR TIPO DE LUGAR (Solo Admin)
  // async updatePlaceType(id: string, data: UpdatePlaceTypeDto): Promise<PlaceType> {
  //   try {
  //     const response = await this.api.patch<ApiResponse<PlaceType>>(
  //       `/place-types/${id}`,
  //       data
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // ELIMINAR TIPO DE LUGAR (Solo Admin)
  // async deletePlaceType(id: string): Promise<void> {
  //   try {
  //     const response = await this.api.delete<ApiResponse<void>>(
  //       `/place-types/${id}`
  //     );
  //     this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // CAMBIAR ESTADO ACTIVO/INACTIVO (Solo Admin)
  // async togglePlaceTypeStatus(id: string): Promise<PlaceType> {
  //   try {
  //     // Primero obtener el tipo actual
  //     const currentType = await this.getPlaceTypeById(id);
      
  //     // Cambiar el estado
  //     return await this.updatePlaceType(id, {
  //       activo: !currentType.activo
  //     });
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // BUSCAR TIPOS POR NOMBRE
  // async searchPlaceTypes(query: string): Promise<PlaceType[]> {
  //   try {
  //     const allTypes = await this.getAllPlaceTypes();
      
  //     if (!query.trim()) {
  //       return allTypes;
  //     }

  //     const searchTerm = query.toLowerCase().trim();
  //     return allTypes.filter(type => 
  //       type.nombre.toLowerCase().includes(searchTerm) ||
  //       (type.descripcion && type.descripcion.toLowerCase().includes(searchTerm))
  //     );
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // VALIDAR SI UN TIPO EXISTE POR NOMBRE
  // async validatePlaceTypeName(nombre: string, excludeId?: string): Promise<boolean> {
  //   try {
  //     const allTypes = await this.getAllPlaceTypes();
  //     const existingType = allTypes.find(type => 
  //       type.nombre.toLowerCase() === nombre.toLowerCase() &&
  //       type.id !== excludeId
  //     );
  //     return !existingType; // Retorna true si NO existe (es válido)
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // // OBTENER TIPOS MÁS UTILIZADOS
  // async getMostUsedPlaceTypes(limit: number = 5): Promise<PlaceType[]> {
  //   try {
  //     const allTypes = await this.getAllPlaceTypes();
  //     return allTypes
  //       .filter(type => type._count?.lugares && type._count.lugares > 0)
  //       .sort((a, b) => (b._count?.lugares || 0) - (a._count?.lugares || 0))
  //       .slice(0, limit);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // MÉTODOS AUXILIARES ADICIONALES

  // // Actualizar la URL base del servicio
  // updateBaseURL(newBaseURL: string): void {
  //   this.baseURL = newBaseURL;
  //   this.api.defaults.baseURL = newBaseURL;
  // }

  // // Configurar token JWT manualmente
  // setAuthToken(token: string): void {
  //   this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // }

  // // Limpiar token JWT
  // clearAuthToken(): void {
  //   delete this.api.defaults.headers.common['Authorization'];
  // }

  // // Validar datos antes de crear/actualizar
  // validatePlaceTypeData(data: CreatePlaceTypeDto | UpdatePlaceTypeDto): string[] {
  //   const errors: string[] = [];

  //   if ('nombre' in data && data.nombre) {
  //     if (data.nombre.trim().length < 2) {
  //       errors.push('El nombre debe tener al menos 2 caracteres');
  //     }
  //     if (data.nombre.length > 50) {
  //       errors.push('El nombre no puede exceder 50 caracteres');
  //     }
  //   }

  //   if ('descripcion' in data && data.descripcion) {
  //     if (data.descripcion.length > 200) {
  //       errors.push('La descripción no puede exceder 200 caracteres');
  //     }
  //   }

  //   if ('color' in data && data.color) {
  //     const colorRegex = /^#[0-9A-Fa-f]{6}$/;
  //     if (!colorRegex.test(data.color)) {
  //       errors.push('El color debe ser un código hexadecimal válido (#RRGGBB)');
  //     }
  //   }

  //   return errors;
  // }

  // // Formatear datos para mostrar
  // formatPlaceTypeForDisplay(placeType: PlaceType): PlaceType & { displayInfo: any } {
  //   return {
  //     ...placeType,
  //     displayInfo: {
  //       statusText: placeType.activo ? 'Activo' : 'Inactivo',
  //       statusColor: placeType.activo ? '#4CAF50' : '#F44336',
  //       createdDateFormatted: new Date(placeType.createdAt).toLocaleDateString('es-PE'),
  //       updatedDateFormatted: new Date(placeType.updatedAt).toLocaleDateString('es-PE'),
  //       placesCount: placeType._count?.lugares || 0,
  //       hasPlaces: (placeType._count?.lugares || 0) > 0,
  //     }
  //   };
  // }

  // // Cache simple para tipos de lugar (opcional)
  // private cache: {
  //   placeTypes: PlaceType[] | null;
  //   timestamp: number | null;
  //   ttl: number; // Time to live en milisegundos
  // } = {
  //   placeTypes: null,
  //   timestamp: null,
  //   ttl: 5 * 60 * 1000, // 5 minutos
  // };

  // // Obtener tipos con cache
  // async getAllPlaceTypesWithCache(): Promise<PlaceType[]> {
  //   const now = Date.now();
    
  //   // Verificar si el cache es válido
  //   if (
  //     this.cache.placeTypes &&
  //     this.cache.timestamp &&
  //     (now - this.cache.timestamp) < this.cache.ttl
  //   ) {
  //     return this.cache.placeTypes;
  //   }

  //   try {
  //     // Obtener datos frescos
  //     const placeTypes = await this.getAllPlaceTypes();
      
  //     // Actualizar cache
  //     this.cache.placeTypes = placeTypes;
  //     this.cache.timestamp = now;
      
  //     return placeTypes;
  //   } catch (error) {
  //     // Si hay error pero tenemos cache, devolverlo
  //     if (this.cache.placeTypes) {
  //       return this.cache.placeTypes;
  //     }
  //     return this.handleError(error);
  //   }
  // }

  // // Limpiar cache
  // clearCache(): void {
  //   this.cache.placeTypes = null;
  //   this.cache.timestamp = null;
  // }
}

// Instancia singleton del servicio
export const placeTypesService = new PlaceTypesService();

// Hook personalizado para React Native
export const usePlaceTypesService = () => {
  return placeTypesService;
};

export default PlaceTypesService;