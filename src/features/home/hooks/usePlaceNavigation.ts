import { Keyboard } from "react-native";

import { usePlaces } from "@context/PlacesContext";

import { Place } from "@types/place";
import { router } from "expo-router";
import { useCallback } from "react";

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

  const startNavigationMode = useCallback(() => {
    setShowPlaceInfo(false);
    setShowRoute(true);
    router.push("/navigation");
  }, [setShowPlaceInfo, setShowRoute]);
  
  return ({
    startNavigationMode,
    handlePlaceSelect
  });
}
