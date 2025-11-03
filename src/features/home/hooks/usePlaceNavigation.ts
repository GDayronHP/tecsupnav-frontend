import { Alert, Keyboard } from "react-native";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { useCallback } from "react";

import { usePlaces } from "@context/PlacesContext";
import type { Place } from "../../../types/place";

export default function usePlaceNavigation() {
  const { setShowRoute, setShowPlaceInfo, setSelectedPlace } = usePlaces();

  const handlePlaceSelect = useCallback(
    (place: Place) => {
      setSelectedPlace(place);
      setShowPlaceInfo(true);
      Keyboard.dismiss();
    },
    [setSelectedPlace, setShowPlaceInfo]
  );

  const startNavigationMode = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          '📍 Ubicación Desactivada',
          'Para iniciar la navegación, por favor activa los permisos de ubicación desde los ajustes de tu dispositivo.',
          [{ text: 'Entendido', style: 'default' }]
        );
        return;
      }

      try {
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });
        
        setShowPlaceInfo(false);
        setShowRoute(true);
        router.push("/navigation");
      } catch (locationError) {
        console.error('❌ Error al obtener ubicación:', locationError);
        Alert.alert(
          '📍 No se puede acceder a la ubicación',
          'Parece que los servicios de ubicación están desactivados. Por favor, activa el GPS en la configuración de tu dispositivo.',
          [{ text: 'Entendido', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      Alert.alert(
        'Error',
        'No se pudo verificar los permisos de ubicación. Por favor, intenta nuevamente.',
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  }, [setShowPlaceInfo, setShowRoute]);
  
  return ({
    startNavigationMode,
    handlePlaceSelect
  });
}
