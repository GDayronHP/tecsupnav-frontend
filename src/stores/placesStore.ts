import { create } from 'zustand';
import { Place } from '../types/place';

interface PlacesStore {
  locations: Place[];
  selectedPlace: Place | null;
  showRoute: boolean;
  showPlaceInfo: boolean;
  
  // Actions
  setLocations: (places: Place[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  setShowRoute: (show: boolean) => void;
  setShowPlaceInfo: (show: boolean) => void;
  
  // Composed actions
  selectPlaceAndShowInfo: (place: Place) => void;
  resetSelection: () => void;
}

export const usePlacesStore = create<PlacesStore>((set) => ({
  locations: [],
  selectedPlace: null,
  showRoute: false,
  showPlaceInfo: false,
  
  setLocations: (places) => set({ locations: places }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setShowRoute: (show) => set({ showRoute: show }),
  setShowPlaceInfo: (show) => set({ showPlaceInfo: show }),
  
  selectPlaceAndShowInfo: (place) => set({
    selectedPlace: place,
    showPlaceInfo: true
  }),
  
  resetSelection: () => set({
    selectedPlace: null,
    showRoute: false,
    showPlaceInfo: false
  })
}));
