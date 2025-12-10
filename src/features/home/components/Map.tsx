import { useEffect} from "react";
import { View, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import type { Place } from "../../../types/place";
import Constants from "expo-constants";

// Hooks & Services
import useMap from "../hooks/useMap";

// Components
import OptimizedMarker from "./OptimizedMarker";
import SelectionPanel from "./SelectionPanel";

const GOOGLE_MAPS_APIKEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_ID = Constants.expoConfig?.extra?.GOOGLE_MAPS_ID;

type MapProps = {
  locations: Place[];
  selectedPlace: Place | null;
  showRoute: boolean;
  onMarkerPress?: (place: Place) => void;
  navigationMode?: boolean;
};

export default function Map({ locations, selectedPlace, showRoute, onMarkerPress, navigationMode }: MapProps) {

  const {
    mapRef,
    userLocation,
    handleRegionChangeComplete,
    handleMarkerPress,
    optimizedMarkers,
    selectedFloor,
    availableFloors,
    setIsFloorPanelExpanded,
    isFloorPanelExpanded,
    setSelectedFloor,
  } = useMap({selectedPlace, showRoute, onMarkerPress, navigationMode, locations});

  const getInitialCamera = () => {
    const baseCamera = {
      pitch: 0,
      heading: -24,
      zoom: 18
    };

    if (navigationMode && userLocation) {
      return {
        center: { 
          latitude: userLocation.latitude, 
          longitude: userLocation.longitude 
        },
        ...baseCamera
      };
    }

    // Default ubication (TECSUP)
    return {
      center: { 
        latitude: -12.04447, 
        longitude: -76.95278 
      },
      ...baseCamera
    };
  };

  useEffect(() => {
    if (navigationMode && userLocation && mapRef.current) {
      const camera = {
        center: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        pitch: 0,
        heading: -24,
        zoom: 18,
      };

      mapRef.current.animateCamera(camera, { duration: 1000 });
      console.log('📍 Navigation mode: Following user location', userLocation);
    }
  }, [userLocation, navigationMode]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        {...(GOOGLE_MAPS_ID ? { googleMapId: GOOGLE_MAPS_ID } : {})}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialCamera={getInitialCamera()}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={!navigationMode}
        mapType="hybrid"
        maxZoomLevel={30}
        minZoomLevel={15}
        rotateEnabled={false}
        pitchEnabled={false}
        followsUserLocation={navigationMode}
        userLocationPriority="high"
        userLocationUpdateInterval={navigationMode ? 1000 : 5000}
        userLocationFastestInterval={navigationMode ? 500 : 2000}
      >

        {optimizedMarkers?.map((markerData) => (
          <OptimizedMarker
            key={markerData.id}
            place={markerData.place}
            isSelected={markerData.isSelected}
            onPress={handleMarkerPress}
            navigationMode={navigationMode}
            selectedFloor={selectedFloor}
          />
        ))}

        {/* Ruta de navegación */}
        {userLocation && selectedPlace && showRoute && GOOGLE_MAPS_APIKEY && (
          <MapViewDirections
            origin={userLocation}
            destination={{
              latitude: selectedPlace.latitud,
              longitude: selectedPlace.longitud,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="#2563eb"
            mode="WALKING"
            optimizeWaypoints={true}
            splitWaypoints={false}
            onStart={(params) => {
              console.log(`🚶 Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onError={(errorMessage) => {
              console.error('❌ MapViewDirections Error:', errorMessage);
              Alert.alert('Error de ruta', 'No se pudo calcular la ruta. Por favor, intenta nuevamente.');
            }}
            resetOnChange={true}
            precision="high"
            timePrecision="now"
            language="es"
            region="PE"
          />
        )}
      </MapView>

      {!navigationMode && availableFloors.length > 1 && (
        <SelectionPanel isFloorPanelExpanded={isFloorPanelExpanded} setIsFloorPanelExpanded={setIsFloorPanelExpanded} selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} availableFloors={availableFloors} />
      )}
    </View>
  );
}