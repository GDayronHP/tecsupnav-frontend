import { useMemo } from 'react';
import type { Place } from '../../types/place';

interface UseOptimizedMarkersProps {
  locations: Place[];
  selectedPlaceId: string | null;
}

export const useOptimizedMarkers = ({ locations, selectedPlaceId }: UseOptimizedMarkersProps) => {
  // Memoizar la lista de markers para evitar re-renders innecesarios
  const memoizedMarkers = useMemo(() => {
    if (!locations || locations.length === 0) return [];
    
    return locations.map(place => ({
      id: place.id,
      coordinate: {
        latitude: place.latitud,
        longitude: place.longitud,
      },
      place,
      isSelected: selectedPlaceId === place.id,
    }));
  }, [locations, selectedPlaceId]);

  return memoizedMarkers;
};

export default useOptimizedMarkers;