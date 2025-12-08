import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { usePlaces } from '@context/PlacesContext';
import { navigationService } from '../services/navigationService';
import * as Location from 'expo-location';
import type { NavigationRequestV1 } from '../../../types/request/navigation_request_v1';
import type { NavigationV1 } from '../../../types/navigation';
import getDistanceFromLatLonInMeters from '@utils/getDistanceFromLatLonInMeters';
import * as Speech from 'expo-speech';

interface UseNavigationReturn {
  // Estados
  isLoading: boolean;
  navigation: NavigationV1 | undefined;
  showNavigationCard: boolean;
  
  // Funciones
  handleCancel: () => void;
  confirmCancel: () => void;
}

export default function useNavigation(): UseNavigationReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNavigationCard, setShowNavigationCard] = useState<boolean>(true);
  const [navigation, setNavigation] = useState<NavigationV1>();
  const [hasArrivedAlertShown, setHasArrivedAlertShown] = useState<boolean>(false);

  const { selectedPlace } = usePlaces();

  const lastPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const lastApiCallRef = useRef<number>(0);
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const MIN_DISTANCE_METERS = useMemo(() => 10, []);
  const MIN_API_INTERVAL = useMemo(() => 5000, []);

  useEffect(() => {
    if (
      !selectedPlace ||
      !selectedPlace.latitud ||
      !selectedPlace.longitud ||
      !selectedPlace.nombre
    ) {
      Alert.alert(
        'Error en el sistema',
        'No se puede iniciar la navegación porque faltan datos del destino.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.back(),
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
      router.back();
      return;
    }
  }, [selectedPlace]);

  // Función para cancelar navegación
  const confirmCancel = useCallback(() => {
    Speech.stop();
    router.back();
  }, []);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar navegación',
      '¿Estás seguro de que deseas cancelar la navegación?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', style: 'destructive', onPress: confirmCancel }
      ],
      { cancelable: true }
    );
  }, [confirmCancel]);

  // Verificar llegada al destino
  const checkArrival = useCallback((navigationData: NavigationV1, currentCoords: { latitude: number; longitude: number }) => {
    if (!navigationData?.destination || !selectedPlace || hasArrivedAlertShown) return;

    const distanceToDestination = getDistanceFromLatLonInMeters(
      currentCoords.latitude,
      currentCoords.longitude,
      selectedPlace.latitud,
      selectedPlace.longitud
    );

    const ARRIVAL_THRESHOLD_METERS = 5;
    const hasArrived = distanceToDestination <= ARRIVAL_THRESHOLD_METERS;

    console.log(`📍 Distancia al destino: ${distanceToDestination.toFixed(2)}m (umbral: ${ARRIVAL_THRESHOLD_METERS}m)`);

    if (hasArrived) {
      setHasArrivedAlertShown(true);
      Speech.stop();

      // ✅ Construir mensaje con información de ubicación
      let locationDetails = '';
      
      if (selectedPlace.edificio || selectedPlace.piso !== undefined) {
        locationDetails = '\n\n📍 Ubicación:';
        
        if (selectedPlace.edificio) {
          locationDetails += `\n• Edificio: ${selectedPlace.edificio}`;
        }
        
        if (selectedPlace.piso !== undefined && selectedPlace.piso !== null) {
          const pisoText = selectedPlace.piso === 0 ? 'Planta Baja' : `Piso ${selectedPlace.piso}`;
          locationDetails += `\n• ${pisoText}`;
        }
      }

      Alert.alert(
        '🎉 ¡Has llegado!',
        `Has llegado exitosamente a ${selectedPlace?.nombre || 'tu destino'}.${locationDetails}\n\n¿Deseas finalizar la navegación?`,
        [
          {
            text: 'Continuar navegando',
            style: 'cancel',
            onPress: () => {
              setTimeout(() => setHasArrivedAlertShown(false), 30000);
            }
          },
          {
            text: 'Finalizar',
            style: 'default',
            onPress: () => {
              router.back();
            }
          }
        ],
        { cancelable: false }
      );
    }
  }, [hasArrivedAlertShown, selectedPlace]);

  // Obtener datos de navegación
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
        const data = await navigationService.createRoute(body);
        if (data.statusCode === 400) {
          Alert.alert('Error', data.message);
          router.back();
          return;
        }

        if (isMountedRef.current) {
          setNavigation(data.data);

          // ✅ CORREGIDO: Pasar las coordenadas actuales a checkArrival
          checkArrival(data.data, coords);

          if (isLoading) setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        if (isMountedRef.current && isLoading) {
          setIsLoading(false);
        }
      }
    }
  }, [selectedPlace, isLoading, MIN_API_INTERVAL, checkArrival]);

  // Manejar actualizaciones de ubicación
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

  // Inicializar seguimiento de ubicación
  useEffect(() => {
    isMountedRef.current = true;

    const startWatching = async () => {
      try {
        // Verificar permisos
        const { status } = await Location.getForegroundPermissionsAsync();
        console.log('📍 Location permission status:', status);
        
        if (status !== "granted") {
          Alert.alert(
            '📍 Ubicación Desactivada',
            'Para continuar con la navegación, necesitas activar los permisos de ubicación desde los ajustes de tu dispositivo.',
            [{ text: 'Entendido', onPress: () => router.back() }]
          );
          return;
        }

        // Intentar obtener la ubicación actual para verificar que realmente funciona
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
        } catch (locationError) {
          console.error('❌ Error al obtener ubicación:', locationError);
          Alert.alert(
            '📍 No se puede acceder a la ubicación',
            'Parece que los servicios de ubicación están desactivados o no se puede acceder a tu ubicación actual. Por favor, verifica la configuración de tu dispositivo.',
            [{ text: 'Entendido', onPress: () => router.back() }]
          );
          return;
        }
      } catch (error) {
        console.error('❌ Error starting location watch:', error);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        Alert.alert(
          'Error',
          'No se pudo iniciar el seguimiento de ubicación. Por favor, intenta nuevamente.',
          [{ text: 'Entendido', onPress: () => router.back() }]
        );
      }
    };

    startWatching();

    return () => {
      isMountedRef.current = false;
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
      }
    };
  }, [fetchNavigationData, handleLocationUpdate]);

  return {
    isLoading,
    navigation,
    showNavigationCard,
    
    handleCancel,
    confirmCancel,
  };
}