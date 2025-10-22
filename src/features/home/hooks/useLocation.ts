import { useEffect, useState } from "react";
import { usePlaces } from "@context/PlacesContext";

import { usePlacesService } from "../services/placeService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const LOCATIONS_KEY = 'tecsupnav_locations';

export function useLocation() {

    const [loadingLocations, setLoadingLocations] = useState(true);

    const { locations, setLocations } = usePlaces();

    useEffect(() => {
        let isMounted = true;

        const loadLocations = async () => {
            try {
                // Load from cache first
                const savedLocations = await AsyncStorage.getItem(LOCATIONS_KEY);
                if (isMounted && savedLocations) {
                    setLocations(JSON.parse(savedLocations));
                }

                // Fetch fresh data
                const apiLocations = await usePlacesService().getAll();
                if (isMounted && Array.isArray(apiLocations)) {
                    setLocations(apiLocations);
                    await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(apiLocations));
                }
            } catch (error) {
                console.error("Error loading locations:", error);
                Alert.alert("Error", "No se pudieron cargar las ubicaciones.");
            } finally {
                if (isMounted) setLoadingLocations(false);
            }
        };

        loadLocations();
        return () => { isMounted = false; };
    }, [setLocations]);
    return ({
        loadingLocations,
        setLoadingLocations,
        locations,
        setLocations
    })
}