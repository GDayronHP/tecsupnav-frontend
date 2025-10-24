import React, {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Place } from '../../types/place';
import { createContext, useContext } from 'react'

const GPS_STATUS_KEY = 'tecsupnav_gps_status';

const PlacesContext = createContext(null);

export function PlacesContextProvider({ children }) {
    const [locations, setLocations] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [showRoute, setShowRoute] = useState<boolean>(false);
    const [showPlaceInfo, setShowPlaceInfo] = useState<boolean>(false);
    const [gpsStatus, setGpsStatusState] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

    useEffect(() => {
        const loadGpsStatus = async () => {
            try {
                const savedStatus = await AsyncStorage.getItem(GPS_STATUS_KEY);
                if (savedStatus && ['granted', 'denied', 'undetermined'].includes(savedStatus)) {
                    console.log('📱 GPS status cargado desde AsyncStorage:', savedStatus);
                    setGpsStatusState(savedStatus as 'granted' | 'denied' | 'undetermined');
                }
            } catch (error) {
                console.error('Error cargando GPS status:', error);
            }
        };

        loadGpsStatus();
    }, []);

    const setGpsStatus = async (status: 'granted' | 'denied' | 'undetermined') => {
        try {
            console.log('📱 Actualizando GPS status:', status);
            setGpsStatusState(status);
            await AsyncStorage.setItem(GPS_STATUS_KEY, status);
        } catch (error) {
            console.error('Error guardando GPS status:', error);
            
            setGpsStatusState(status);
        }
    };

    return (
        <PlacesContext.Provider value={{ 
            locations, 
            setLocations, 
            selectedPlace, 
            setSelectedPlace, 
            showRoute, 
            setShowRoute, 
            showPlaceInfo, 
            setShowPlaceInfo, 
            gpsStatus, 
            setGpsStatus 
        }}>
            {children}
        </PlacesContext.Provider>
    )
}
    
export function usePlaces() {
    return useContext(PlacesContext);
}