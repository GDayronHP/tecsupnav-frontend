import { useMemo } from 'react';
import type { Place } from '../../types/place';

interface UseOptimizedMarkersProps {
  locations: Place[];
  selectedPlaceId: string | null;
  region?: MapRegion | null;
  maxMarkers?: number;
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const useOptimizedMarkers = ({ 
  locations, 
  selectedPlaceId, 
  region = null, 
  maxMarkers = 50 
}: UseOptimizedMarkersProps) => {
  // Memoizar la lista de markers optimizada
  const memoizedMarkers = useMemo(() => {
    if (!locations || locations.length === 0) return [];
    
    let filteredLocations = locations;

    // Filtrar por viewport si hay región disponible
    if (region) {
      const padding = 0.001; // Padding para markers en los bordes
      const north = region.latitude + (region.latitudeDelta / 2) + padding;
      const south = region.latitude - (region.latitudeDelta / 2) - padding;
      const east = region.longitude + (region.longitudeDelta / 2) + padding;
      const west = region.longitude - (region.longitudeDelta / 2) - padding;

      filteredLocations = locations.filter(place => 
        place.latitud >= south &&
        place.latitud <= north &&
        place.longitud >= west &&
        place.longitud <= east
      );

      // Limitar cantidad de markers si hay muchos
      if (filteredLocations.length > maxMarkers) {
        const centerLat = region.latitude;
        const centerLng = region.longitude;
        
        filteredLocations = filteredLocations
          .map(place => ({
            ...place,
            distance: Math.sqrt(
              Math.pow(place.latitud - centerLat, 2) + 
              Math.pow(place.longitud - centerLng, 2)
            )
          }))
          .sort((a, b) => (a as any).distance - (b as any).distance)
          .slice(0, maxMarkers)
          .map(({ distance, ...place }) => place);
      }
    }
    
    return filteredLocations.map(place => ({
      id: place.id,
      coordinate: {
        latitude: place.latitud,
        longitude: place.longitud,
      },
      place,
      isSelected: selectedPlaceId === place.id,
    }));
  }, [locations, selectedPlaceId, region, maxMarkers]);

  return memoizedMarkers;
};

export default useOptimizedMarkers;