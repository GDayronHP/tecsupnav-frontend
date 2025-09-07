import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function Map() {

  const [region, setRegion] = useState({
    latitude: -12.044345,
    longitude:  -76.952688,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{ latitude: -12.04318, longitude: -77.02824 }}
          title="Edificio Principal"
          description="Punto de referencia del campus"
        />
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
