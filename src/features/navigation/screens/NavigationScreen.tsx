import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import Map from '@features/home/components/Map';
import { usePlaces } from '@context/PlacesContext';
import PlaceInfoCard from '@features/home/components/PlaceInfoCard';
import NavigationCard from '../components/NavigationCard';
import { navigationService } from '../services/navigationService';
import * as Location from 'expo-location';
import type { NavigationRequestV1 } from '../../../types/request/navigation_request_v1';
import type { Navigation } from '../../../types/navigation';
import Loading from '@components/Loading';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShowPlaceInfoCardBtn from '../components/ShowPlaceInfoBtn';

// Optimización 1: Extraer función fuera del componente
const getDistanceFromLatLonInMeters = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NavigationScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNavigationCard, setShowNavigationCard] = useState<boolean>(true);
  const [showPlaceInfo, setShowPlaceInfo] = useState<boolean>(false);
  const [navigation, setNavigation] = useState<Navigation>();

  const cardTranslateY = useSharedValue(300);
  const cardOpacity = useSharedValue(0);
  const placeInfoCardOpacity = useSharedValue(1);

  const { locations, selectedPlace, showRoute, gpsStatus } = usePlaces();

  const lastPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const lastApiCallRef = useRef<number>(0);
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const MIN_DISTANCE_METERS = useMemo(() => 10, []);
  const MIN_API_INTERVAL = useMemo(() => 5000, []);

  const onClosePlaceInfo = useCallback(() => {
    setShowPlaceInfo(false);
  }, []);

  const fetchNavigationData = useCallback(async (coords: { latitude: number; longitude: number }) => {
    const now = Date.now();
    if (now - lastApiCallRef.current < MIN_API_INTERVAL) {
      return;
    }

    const body: NavigationRequestV1 = {
      currentLat: coords.latitude,
      currentLng: coords.longitude,
      destinationId: selectedPlace?.id || 0,
      mode: 'walking',
      accessible: true,
      fastest: true,
    };

    if (selectedPlace && isMountedRef.current) {
      try {
        lastApiCallRef.current = now;
        const data = await navigationService.getAll(body);
        if (isMountedRef.current) {
          setNavigation(data);
          if (isLoading) setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        if (isMountedRef.current && isLoading) {
          setIsLoading(false);
        }
      }
    }
  }, [selectedPlace, isLoading, MIN_API_INTERVAL]);

  const handleLocationUpdate = useCallback((location: Location.LocationObject) => {
    const { latitude, longitude } = location.coords;
    const last = lastPositionRef.current;

    if (!last) {
      lastPositionRef.current = { latitude, longitude };
      fetchNavigationData({ latitude, longitude });
      return;
    }

    requestAnimationFrame(() => {
      const distance = getDistanceFromLatLonInMeters(
        last.latitude, 
        last.longitude, 
        latitude, 
        longitude
      );

      if (distance >= MIN_DISTANCE_METERS) {
        lastPositionRef.current = { latitude, longitude };
        fetchNavigationData({ latitude, longitude });
      }
    });
  }, [fetchNavigationData, MIN_DISTANCE_METERS]);

  useEffect(() => {
    isMountedRef.current = true;

    const startWatching = async () => {
      if (gpsStatus !== "granted") return;

      try {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        if (initialLocation && isMountedRef.current) {
          const coords = {
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
          };
          lastPositionRef.current = coords;
          fetchNavigationData(coords);
        }

        watchSubscriptionRef.current = await Location.watchPositionAsync(
          { 
            accuracy: Location.Accuracy.Balanced, 
            timeInterval: 5000,
            distanceInterval: 5,
          },
          handleLocationUpdate
        );
      } catch (error) {
        console.error('Error starting location watch:', error);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    startWatching();

    return () => {
      isMountedRef.current = false;
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
      }
    };
  }, [gpsStatus, fetchNavigationData, handleLocationUpdate]);

  useEffect(() => {
    if (showNavigationCard) {
      cardOpacity.value = withTiming(1, { duration: 300 });
      cardTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [showNavigationCard, cardOpacity, cardTranslateY]);

  const memoizedMap = useMemo(() => (
    <Map 
      locations={locations} 
      selectedPlace={selectedPlace} 
      showRoute={showRoute} 
    />
  ), [locations, selectedPlace, showRoute]);

  if (isLoading) {
    return (
      <Loading 
        title='Preparando navegación' 
        description='Calculando ruta y pasos a seguir...' 
      />
    );
  }
  
  return (
    <View className="flex-1 bg-white">
      {showNavigationCard && (
        <NavigationCard navigationData={navigation} />
      )}

      {memoizedMap}

      {!showPlaceInfo && (
        <ShowPlaceInfoCardBtn setShowPlaceInfo={setShowPlaceInfo} />
      )}

      {showNavigationCard && (
        <PlaceInfoCard 
          place={selectedPlace} 
          isVisible={showPlaceInfo && !!selectedPlace} 
          onClose={onClosePlaceInfo} 
          realTimeNavigation={true} 
          navigationData={navigation} 
        />
      )}
    </View>
  );
}