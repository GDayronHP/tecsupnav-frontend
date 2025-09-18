import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { Place } from "@types/place";

const GOOGLE_MAPS_APIKEY = "AIzaSyBsSNkY076hgHkmxlS9oysFcF7hTH3S1yM"; // Replace with your actual API key

type MapProps = {
  locations: Place[];
  selectedPlace: Place | null;
  showRoute: boolean;
};

export default function Map({ locations, selectedPlace, showRoute }: MapProps) {

  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: -12.044345,
    longitude:  -76.952688,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const animateToLocation = (location: { latitude: number; longitude: number }) => {
    mapRef.current?.animateToRegion({
      ...location,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    }, 1000);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      const location = {
        latitude: selectedPlace.latitud,
        longitude: selectedPlace.longitud,
      };
      animateToLocation(location);
    }
  }, [selectedPlace]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {locations?.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitud, longitude: loc.longitud }}
            title={loc.nombre}
            description={loc.descripcion}
          />
        ))}

        {/* Dibuja la ruta si hay destino y ubicación actual */}
        {/* {userLocation && selectedPlace && showRoute && (
          <MapViewDirections
            origin={userLocation}
            destination={{
              latitude: selectedPlace.latitud,
              longitude: selectedPlace.longitud,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#00BCD4"
            mode="WALKING"
          />
        )} */}
      </MapView>
      <View style={styles.infoBox}>
        <Text>
          Lat: {region.latitude.toFixed(5)}, Lng: {region.longitude.toFixed(5)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
  },
});
