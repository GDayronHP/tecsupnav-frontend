import { View, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import type { Place } from "@types/place";
import Constants from "expo-constants";

// Hooks & Services
import useMap from "../hooks/useMap";

// Components
import OptimizedMarker from "./OptimizedMarker";

const GOOGLE_MAPS_APIKEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;

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
    memoizedLocations 
  } = useMap(selectedPlace, showRoute, onMarkerPress, navigationMode, locations);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialCamera={{
          center: { latitude: -12.04447, longitude: -76.95278 },
          pitch: 0,
          heading: -24,
          zoom: 17
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="hybrid"
        maxZoomLevel={20}
        minZoomLevel={15}
      >

        {memoizedLocations?.map((loc) => (
          <OptimizedMarker
            key={loc.id}
            place={loc}
            isSelected={selectedPlace?.id === loc.id}
            onPress={handleMarkerPress}
            navigationMode={navigationMode}
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
    </View>
  );
}