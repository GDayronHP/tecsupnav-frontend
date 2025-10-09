import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { usePerformantAnimation } from '@hooks/usePerformantAnimation';
import { router } from 'expo-router';
import Map from '@features/home/components/Map';
import { usePlaces } from '@context/PlacesContext';
import PlaceInfoCard from '@features/home/components/PlaceInfoCard';
import NavigationCard from '../components/NavigationCard';
import { navigationService } from '../services/navigationService';
import * as Location from 'expo-location';
import type { NavigationRequestV1 } from '../../../types/request/navigation_request_v1';
import type { Navigation } from '../../../types/navigation';
import Loading from '@components/Loading';
import ShowPlaceInfoCardBtn from '../components/ShowPlaceInfoBtn';

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

  const { animatedValue: cardTranslateY, animateWithSpring: animateCardTranslateY } = usePerformantAnimation(300);
  const { animatedValue: cardOpacity, animateWithTiming: animateCardOpacity } = usePerformantAnimation(0);

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
      animateCardOpacity(1, { duration: 300 });
      animateCardTranslateY(0, {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [showNavigationCard, animateCardOpacity, animateCardTranslateY]);

  const memoizedMap = useMemo(() => (
    <Map 
      locations={locations} 
      selectedPlace={selectedPlace} 
      showRoute={showRoute}
      onMarkerPress={(place) => {
        // En navegación, al tocar un marker se puede cambiar el destino
        // o simplemente mostrar la información
        setShowPlaceInfo(true);
      }}
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
      {/* Botón de volver */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg justify-center items-center"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#00BCD4" />
      </TouchableOpacity>

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