import { Place, PlaceCount, PlaceType } from '@types/place';
import { PlacesResponse } from '@types/place_response_v1';
import { httpGet } from '@utils/httpClient';

// Types y interfaces
export interface Location {
  lat: number;
  lng: number;
}

export interface CreatePlaceDto {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  edificio?: string;
  piso?: number;
  capacidad?: number;
  coordenadas: Location;
  tipoId: string;
  activo?: boolean;
  accesible?: boolean;
  exterior?: boolean;
  horarios?: string;
  contacto?: string;
  imagenes?: string[];
  etiquetas?: string[];
}

export interface UpdatePlaceDto {
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  edificio?: string;
  piso?: number;
  capacidad?: number;
  coordenadas?: Location;
  tipoId?: string;
  activo?: boolean;
  accesible?: boolean;
  exterior?: boolean;
  horarios?: string;
  contacto?: string;
  imagenes?: string[];
  etiquetas?: string[];
}

export interface SearchPlacesDto {
  query?: string;
  tipoId?: string;
  edificio?: string;
  piso?: number;
  accesible?: boolean;
  exterior?: boolean;
  activo?: boolean;
  lat?: number; // Para calcular distancias
  lng?: number;
  radius?: number; // Radio en metros para búsqueda cercana
  page?: number;
  limit?: number;
  sortBy?: 'nombre' | 'tipo' | 'edificio' | 'distancia' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchPlacesResult {
  places: Place[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PlaceStats {
  total: number;
  active: number;
  inactive: number;
  byType: Array<{
    tipo: string;
    count: number;
    percentage: number;
  }>;
  byBuilding: Array<{
    edificio: string;
    count: number;
  }>;
  byFloor: Array<{
    piso: number;
    count: number;
  }>;
  accessibility: {
    accessible: number;
    notAccessible: number;
  };
  location: {
    interior: number;
    exterior: number;
  };
  capacity: {
    total: number;
    average: number;
    max: number;
  };
  recentlyAdded: Place[];
  mostSearched: Array<{
    id: string;
    nombre: string;
    searchCount: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: SearchPlacesResult['pagination'];
  total?: number;
  statusCode?: number;
}

class PlaceService {
  private baseURL: string;

  constructor(baseURL: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    // this.setupInterceptors();
  }

  async getAll(): Promise<Place[]> {
    const data = await httpGet<PlacesResponse>(this.baseURL,'/places');
    return data.data;
  }


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

  // // Método auxiliar para manejar respuestas con paginación
  // private handlePaginatedResponse(response: AxiosResponse<ApiResponse<Place[]>>): SearchPlacesResult {
  //   const { data } = response;
  //   if (!data.success) {
  //     throw new Error(data.message || 'Error en la petición');
  //   }
  //   return {
  //     places: data.data!,
  //     pagination: data.pagination!,
  //   };
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

  // // CREAR LUGAR (Solo Admin)
  // async createPlace(data: CreatePlaceDto): Promise<Place> {
  //   try {
  //     const response = await this.api.post<ApiResponse<Place>>(
  //       '/places',
  //       data
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // BUSCAR LUGARES CON FILTROS Y PAGINACIÓN
  // async searchPlaces(params: SearchPlacesDto = {}): Promise<SearchPlacesResult> {
  //   try {
  //     const queryParams = new URLSearchParams();
      
  //     if (params.query) queryParams.append('query', params.query);
  //     if (params.tipoId) queryParams.append('tipoId', params.tipoId);
  //     if (params.edificio) queryParams.append('edificio', params.edificio);
  //     if (params.piso !== undefined) queryParams.append('piso', params.piso.toString());
  //     if (params.accesible !== undefined) queryParams.append('accesible', params.accesible.toString());
  //     if (params.exterior !== undefined) queryParams.append('exterior', params.exterior.toString());
  //     if (params.activo !== undefined) queryParams.append('activo', params.activo.toString());
  //     if (params.lat !== undefined) queryParams.append('lat', params.lat.toString());
  //     if (params.lng !== undefined) queryParams.append('lng', params.lng.toString());
  //     if (params.radius !== undefined) queryParams.append('radius', params.radius.toString());
  //     if (params.page) queryParams.append('page', params.page.toString());
  //     if (params.limit) queryParams.append('limit', params.limit.toString());
  //     if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  //     if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  //     const response = await this.api.get<ApiResponse<Place[]>>(
  //       `/places?${queryParams.toString()}`
  //     );
  //     return this.handlePaginatedResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // BÚSQUEDA POR TEXTO (para asistente IA)
  // async searchByText(query: string): Promise<Place[]> {
  //   try {
  //     if (!query || query.trim().length < 2) {
  //       throw new Error('La consulta debe tener al menos 2 caracteres');
  //     }

  //     const queryParams = new URLSearchParams();
  //     queryParams.append('q', query.trim());

  //     const response = await this.api.get<ApiResponse<Place[]>>(
  //       `/places/search?${queryParams.toString()}`
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // OBTENER ESTADÍSTICAS (Solo Admin)
  // async getPlacesStats(): Promise<PlaceStats> {
  //   try {
  //     const response = await this.api.get<ApiResponse<PlaceStats>>(
  //       '/places/stats'
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // OBTENER LUGAR POR ID
  // async getPlaceById(id: string): Promise<Place> {
  //   try {
  //     const response = await this.api.get<ApiResponse<Place>>(
  //       `/places/${id}`
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // ACTUALIZAR LUGAR (Solo Admin)
  // async updatePlace(id: string, data: UpdatePlaceDto): Promise<Place> {
  //   try {
  //     const response = await this.api.patch<ApiResponse<Place>>(
  //       `/places/${id}`,
  //       data
  //     );
  //     return this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // ELIMINAR LUGAR (Solo Admin)
  // async deletePlace(id: string): Promise<void> {
  //   try {
  //     const response = await this.api.delete<ApiResponse<void>>(
  //       `/places/${id}`
  //     );
  //     this.handleResponse(response);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // MÉTODOS AUXILIARES ADICIONALES

  // // Obtener todos los lugares activos
  // async getAllActivePlaces(): Promise<Place[]> {
  //   try {
  //     const result = await this.searchPlaces({
  //       page: 1,
  //       limit: 1000,
  //       activo: true,
  //       sortBy: 'nombre',
  //       sortOrder: 'asc',
  //     });
  //     return result.places;
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Buscar lugares cercanos a una ubicación
  // async findNearbyPlaces(
  //   location: Location,
  //   radius: number = 500,
  //   filters?: Partial<SearchPlacesDto>
  // ): Promise<Place[]> {
  //   try {
  //     const params: SearchPlacesDto = {
  //       lat: location.lat,
  //       lng: location.lng,
  //       radius,
  //       activo: true,
  //       page: 1,
  //       limit: 50,
  //       sortBy: 'distancia',
  //       sortOrder: 'asc',
  //       ...filters,
  //     };

  //     const result = await this.searchPlaces(params);
  //     return result.places;
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Buscar lugares por tipo
  // async findPlacesByType(tipoId: string, limit: number = 20): Promise<Place[]> {
  //   try {
  //     const result = await this.searchPlaces({
  //       tipoId,
  //       activo: true,
  //       page: 1,
  //       limit,
  //       sortBy: 'nombre',
  //       sortOrder: 'asc',
  //     });
  //     return result.places;
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Buscar lugares por edificio
  // async findPlacesByBuilding(edificio: string, piso?: number): Promise<Place[]> {
  //   try {
  //     const result = await this.searchPlaces({
  //       edificio,
  //       piso,
  //       activo: true,
  //       page: 1,
  //       limit: 100,
  //       sortBy: 'nombre',
  //       sortOrder: 'asc',
  //     });
  //     return result.places;
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Búsqueda inteligente con múltiples criterios
  // async intelligentSearch(criteria: {
  //   text?: string;
  //   location?: Location;
  //   accessibility?: boolean;
  //   indoor?: boolean; // true para interiores, false para exteriores
  //   capacity?: { min?: number; max?: number };
  //   building?: string;
  //   floor?: number;
  //   type?: string;
  //   limit?: number;
  // }): Promise<Place[]> {
  //   try {
  //     const params: SearchPlacesDto = {
  //       page: 1,
  //       limit: criteria.limit || 20,
  //       activo: true,
  //     };

  //     if (criteria.text) {
  //       // Usar búsqueda por texto si se proporciona
  //       return await this.searchByText(criteria.text);
  //     }

  //     if (criteria.location) {
  //       params.lat = criteria.location.lat;
  //       params.lng = criteria.location.lng;
  //       params.radius = 1000; // 1km por defecto
  //       params.sortBy = 'distancia';
  //       params.sortOrder = 'asc';
  //     }

  //     if (criteria.accessibility !== undefined) {
  //       params.accesible = criteria.accessibility;
  //     }

  //     if (criteria.indoor !== undefined) {
  //       params.exterior = !criteria.indoor;
  //     }

  //     if (criteria.building) {
  //       params.edificio = criteria.building;
  //     }

  //     if (criteria.floor !== undefined) {
  //       params.piso = criteria.floor;
  //     }

  //     if (criteria.type) {
  //       params.tipoId = criteria.type;
  //     }

  //     const result = await this.searchPlaces(params);
  //     let places = result.places;

  //     // Filtrar por capacidad si se especifica
  //     if (criteria.capacity) {
  //       places = places.filter(place => {
  //         if (!place.capacidad) return true; // Si no tiene capacidad definida, incluirlo
          
  //         if (criteria.capacity!.min && place.capacidad < criteria.capacity!.min) {
  //           return false;
  //         }
          
  //         if (criteria.capacity!.max && place.capacidad > criteria.capacity!.max) {
  //           return false;
  //         }
          
  //         return true;
  //       });
  //     }

  //     return places;
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Obtener sugerencias de lugares populares
  // async getPopularPlaces(limit: number = 10): Promise<Place[]> {
  //   try {
  //     // Buscar lugares con mayor capacidad y en edificios principales
  //     const result = await this.searchPlaces({
  //       page: 1,
  //       limit,
  //       activo: true,
  //       sortBy: 'nombre',
  //       sortOrder: 'asc',
  //     });

  //     // Filtrar lugares que probablemente sean populares
  //     const popularTypes = ['Aula', 'Laboratorio', 'Biblioteca', 'Cafetería', 'Auditorio'];
  //     return result.places.filter(place => 
  //       popularTypes.some(type => 
  //         place.tipo.nombre.toLowerCase().includes(type.toLowerCase())
  //       )
  //     ).slice(0, limit);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Validar datos de lugar antes de crear/actualizar
  // validatePlaceData(data: CreatePlaceDto | UpdatePlaceDto): string[] {
  //   const errors: string[] = [];

  //   if ('nombre' in data && data.nombre) {
  //     if (data.nombre.trim().length < 3) {
  //       errors.push('El nombre debe tener al menos 3 caracteres');
  //     }
  //     if (data.nombre.length > 100) {
  //       errors.push('El nombre no puede exceder 100 caracteres');
  //     }
  //   }

  //   if ('descripcion' in data && data.descripcion && data.descripcion.length > 500) {
  //     errors.push('La descripción no puede exceder 500 caracteres');
  //   }

  //   if ('codigo' in data && data.codigo && data.codigo.length > 20) {
  //     errors.push('El código no puede exceder 20 caracteres');
  //   }

  //   if ('edificio' in data && data.edificio && data.edificio.length > 50) {
  //     errors.push('El nombre del edificio no puede exceder 50 caracteres');
  //   }

  //   if ('piso' in data && data.piso !== undefined) {
  //     if (data.piso < -5 || data.piso > 50) {
  //       errors.push('El piso debe estar entre -5 y 50');
  //     }
  //   }

  //   if ('capacidad' in data && data.capacidad !== undefined) {
  //     if (data.capacidad < 0) {
  //       errors.push('La capacidad no puede ser negativa');
  //     }
  //     if (data.capacidad > 10000) {
  //       errors.push('La capacidad no puede exceder 10,000');
  //     }
  //   }

  //   if ('coordenadas' in data && data.coordenadas) {
  //     if (data.coordenadas.lat < -90 || data.coordenadas.lat > 90) {
  //       errors.push('La latitud debe estar entre -90 y 90');
  //     }
  //     if (data.coordenadas.lng < -180 || data.coordenadas.lng > 180) {
  //       errors.push('La longitud debe estar entre -180 y 180');
  //     }
  //   }

  //   return errors;
  // }

  // // Formatear lugar para mostrar
  // formatPlaceForDisplay(place: Place): Place & { displayInfo: any } {
  //   return {
  //     ...place,
  //     displayInfo: {
  //       fullName: `${place.nombre}${place.codigo ? ` (${place.codigo})` : ''}`,
  //       location: this.getLocationText(place),
  //       statusText: place.activo ? 'Activo' : 'Inactivo',
  //       statusColor: place.activo ? '#4CAF50' : '#F44336',
  //       accessibilityText: place.accesible ? 'Accesible' : 'No accesible',
  //       locationTypeText: place.exterior ? 'Exterior' : 'Interior',
  //       capacityText: place.capacidad ? `${place.capacidad} personas` : 'Sin especificar',
  //       distanceText: place.distancia ? `${Math.round(place.distancia)}m` : null,
  //       createdDateFormatted: new Date(place.createdAt).toLocaleDateString('es-PE'),
  //       typeColor: place.tipo.color || '#007AFF',
  //       typeIcon: place.tipo.icono,
  //       tagsText: place.etiquetas?.join(', ') || '',
  //       hasImages: place.imagenes && place.imagenes.length > 0,
  //       imageCount: place.imagenes?.length || 0,
  //     }
  //   };
  // }

  // private getLocationText(place: Place): string {
  //   const parts: string[] = [];
    
  //   if (place.edificio) {
  //     parts.push(place.edificio);
  //   }
    
  //   if (place.piso !== undefined && place.piso !== null) {
  //     const pisoText = place.piso === 0 ? 'PB' : 
  //                     place.piso > 0 ? `${place.piso}° piso` : 
  //                     `S${Math.abs(place.piso)}`;
  //     parts.push(pisoText);
  //   }

  //   return parts.length > 0 ? parts.join(' - ') : 'Ubicación no especificada';
  // }

  // // Calcular distancia entre dos lugares
  // calculateDistance(place1: Place, place2: Place): number {
  //   return this.calculateDistanceBetweenCoordinates(
  //     place1.coordenadas,
  //     place2.coordenadas
  //   );
  // }

  // // Calcular distancia entre coordenadas (fórmula de Haversine)
  // calculateDistanceBetweenCoordinates(coord1: Location, coord2: Location): number {
  //   const R = 6371e3; // Radio de la Tierra en metros
  //   const φ1 = coord1.lat * Math.PI/180;
  //   const φ2 = coord2.lat * Math.PI/180;
  //   const Δφ = (coord2.lat-coord1.lat) * Math.PI/180;
  //   const Δλ = (coord2.lng-coord1.lng) * Math.PI/180;

  //   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
  //             Math.cos(φ1) * Math.cos(φ2) *
  //             Math.sin(Δλ/2) * Math.sin(Δλ/2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  //   return R * c; // Distancia en metros
  // }

  // // Obtener lista de edificios únicos
  // async getBuildings(): Promise<string[]> {
  //   try {
  //     const places = await this.getAllActivePlaces();
  //     const buildings = new Set(
  //       places
  //         .map(place => place.edificio)
  //         .filter(edificio => edificio && edificio.trim().length > 0)
  //     );
  //     return Array.from(buildings).sort();
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // Obtener pisos de un edificio
  // async getFloorsByBuilding(edificio: string): Promise<number[]> {
  //   try {
  //     const places = await this.findPlacesByBuilding(edificio);
  //     const floors = new Set(
  //       places
  //         .map(place => place.piso)
  //         .filter(piso => piso !== undefined && piso !== null)
  //     );
  //     return Array.from(floors).sort((a, b) => a - b);
  //   } catch (error) {
  //     return this.handleError(error);
  //   }
  // }

  // // MÉTODOS DE CONFIGURACIÓN

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

  // // Cache simple para lugares (opcional)
  // private cache: {
  //   places: Place[] | null;
  //   timestamp: number | null;
  //   ttl: number; // Time to live en milisegundos
  // } = {
  //   places: null,
  //   timestamp: null,
  //   ttl: 10 * 60 * 1000, // 10 minutos
  // };

  // // Obtener lugares con cache
  // async getAllActivePlacesWithCache(): Promise<Place[]> {
  //   const now = Date.now();
    
  //   // Verificar si el cache es válido
  //   if (
  //     this.cache.places &&
  //     this.cache.timestamp &&
  //     (now - this.cache.timestamp) < this.cache.ttl
  //   ) {
  //     return this.cache.places;
  //   }

  //   try {
  //     // Obtener datos frescos
  //     const places = await this.getAllActivePlaces();
      
  //     // Actualizar cache
  //     this.cache.places = places;
  //     this.cache.timestamp = now;
      
  //     return places;
  //   } catch (error) {
  //     // Si hay error pero tenemos cache, devolverlo
  //     if (this.cache.places) {
  //       return this.cache.places;
  //     }
  //     return this.handleError(error);
  //   }
  // }

  // // Limpiar cache
  // clearCache(): void {
  //   this.cache.places = null;
  //   this.cache.timestamp = null;
  // }
}

// Instancia singleton del servicio
export const placesService = new PlaceService();

// Hook personalizado para React Native
export const usePlacesService = () => {
  return placesService;
};

export default PlaceService;