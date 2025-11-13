import React, { useState, useMemo, useCallback } from 'react';
import { Place } from '../../types/place';
import { createContext, useContext } from 'react';

interface PlacesContextType {
  locations: Place[];
  setLocations: (places: Place[]) => void;
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
  showRoute: boolean;
  setShowRoute: (show: boolean) => void;
  showPlaceInfo: boolean;
  setShowPlaceInfo: (show: boolean) => void;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function PlacesContextProvider({ children }: { children: React.ReactNode }) {
    const [locations, setLocations] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [showRoute, setShowRoute] = useState<boolean>(false);
    const [showPlaceInfo, setShowPlaceInfo] = useState<boolean>(false);

    // Memoizar callbacks para evitar re-renders
    const setSelectedPlaceCallback = useCallback((place: Place | null) => {
        setSelectedPlace(place);
    }, []);

    const setShowRouteCallback = useCallback((show: boolean) => {
        setShowRoute(show);
    }, []);

    const setShowPlaceInfoCallback = useCallback((show: boolean) => {
        setShowPlaceInfo(show);
    }, []);

    // Memoizar el valor del contexto
    const contextValue = useMemo(() => ({
        locations,
        setLocations,
        selectedPlace,
        setSelectedPlace: setSelectedPlaceCallback,
        showRoute,
        setShowRoute: setShowRouteCallback,
        showPlaceInfo,
        setShowPlaceInfo: setShowPlaceInfoCallback
    }), [locations, selectedPlace, showRoute, showPlaceInfo, setSelectedPlaceCallback, setShowRouteCallback, setShowPlaceInfoCallback]);

    return (
        <PlacesContext.Provider value={contextValue}>
            {children}
        </PlacesContext.Provider>
    )
}
    
export function usePlaces(): PlacesContextType {
    const context = useContext(PlacesContext);
    if (!context) {
        throw new Error('usePlaces must be used within a PlacesContextProvider');
    }
    return context;
}