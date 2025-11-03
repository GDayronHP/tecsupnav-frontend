import React, {useState} from 'react'

import { Place } from '../../types/place';
import { createContext, useContext } from 'react'

const PlacesContext = createContext(null);

export function PlacesContextProvider({ children }) {
    const [locations, setLocations] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [showRoute, setShowRoute] = useState<boolean>(false);
    const [showPlaceInfo, setShowPlaceInfo] = useState<boolean>(false);

    return (
        <PlacesContext.Provider value={{ 
            locations, 
            setLocations, 
            selectedPlace, 
            setSelectedPlace, 
            showRoute, 
            setShowRoute, 
            showPlaceInfo, 
            setShowPlaceInfo
        }}>
            {children}
        </PlacesContext.Provider>
    )
}
    
export function usePlaces() {
    return useContext(PlacesContext);
}