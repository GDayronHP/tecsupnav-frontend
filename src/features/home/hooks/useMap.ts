import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import MapView from 'react-native-maps';

// Hooks
import { useLocation } from '@hooks/useLocation';
import { usePerformantAnimation } from '@hooks/usePerformantAnimation';

import { Place } from '@types/place';

const tecsupGroundOverlayBounds = {
    southWest: { latitude: -12.045581, longitude: -76.953785 },
    northEast: { latitude: -12.043138, longitude: -76.951569 },
};

export default function useMap(selectedPlace: Place, showRoute: boolean, onMarkerPress?: (place: Place) => void, navigationMode?: boolean, locations?: Place[]) {

    const [region, setRegion] = useState({
        latitude: -12.044345,
        longitude: -76.952688,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const mapRef = useRef<MapView>(null);

    const [showImageOverlay, setShowImageOverlay] = useState(false);
    const { location, errorMsg, loading } = useLocation();
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // Performance-aware animation hooks
    const { animatedValue: overlayOpacity, animateWithTiming: animateOpacity } = usePerformantAnimation(0);
    const { animatedValue: overlayScale, animateWithTiming: animateScale } = usePerformantAnimation(0.8);

    const showImageOverlayWithAnimation = useCallback(() => {
        setShowImageOverlay(true);
        animateOpacity(1, { duration: 300 });
        animateScale(1, { duration: 300 });
    }, [animateOpacity, animateScale]);

    const animateToLocation = (
        location: { latitude: number; longitude: number },
        opts?: { zoom?: number; duration?: number }
    ) => {
        const camera: any = {
            center: { latitude: location.latitude, longitude: location.longitude },
        };

        if (typeof opts?.zoom === 'number') camera.zoom = opts!.zoom;

        mapRef.current?.animateCamera(camera, { duration: opts?.duration ?? 1000 });
    };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setMapBoundaries(tecsupGroundOverlayBounds.northEast, tecsupGroundOverlayBounds.southWest);
        }
    }, [])

    useEffect(() => {
        if (loading) return;
        if (errorMsg) {
            console.error('Location Error:', errorMsg);
            return;
        }
        if (location) {
            const newUserLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setUserLocation(newUserLocation);
            console.log('User location updated:', newUserLocation);
        }
    }, [loading, errorMsg, location]);

    useEffect(() => {
        if (!selectedPlace) return;

        const placeLocation = {
            latitude: selectedPlace.latitud,
            longitude: selectedPlace.longitud,
        };

        if (!showRoute) {
            animateToLocation(placeLocation, { zoom: 19, duration: 600 });
        } else {
            animateToLocation(placeLocation, { duration: 800 });
        }
    }, [selectedPlace?.id, selectedPlace?.latitud, selectedPlace?.longitud, showRoute]);

    // Debounce region changes
    const handleRegionChangeComplete = useCallback((newRegion: any) => {
        setRegion(newRegion);
    }, []);

    // Memoize callbacks to avoid re-renders
    const handleMarkerPress = useCallback((place: Place) => {
        console.log("🔍 Map - Marker pressed:", place.nombre);
        onMarkerPress?.(place);
    }, [onMarkerPress]);

    const memoizedLocations = useMemo(() => {
        if (navigationMode && selectedPlace) {
            return [selectedPlace];
        }
        return locations;
    }, [locations.length, selectedPlace?.id, navigationMode]);


    return (
        {
            mapRef,
            showImageOverlay,
            userLocation,
            overlayOpacity,
            overlayScale,
            showImageOverlayWithAnimation,
            handleRegionChangeComplete,
            handleMarkerPress,
            memoizedLocations
        }
    )
}