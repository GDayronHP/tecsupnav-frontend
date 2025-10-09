import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Overlay} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import type { Place } from "../../../types/place";
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Constants from "expo-constants";
import { usePerformantAnimation, useButtonScale } from '../../../shared/hooks/usePerformantAnimation';

// Componente de botón animado para el mapa
const AnimatedButton = ({ children, onPress, className, style, activeOpacity }: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: any;
  activeOpacity?: number;
}) => {
  const { scale, scaleDown, scaleUp } = useButtonScale();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <TouchableOpacity
      onPressIn={scaleDown}
      onPressOut={scaleUp}
      onPress={onPress}
      activeOpacity={activeOpacity || 1}
      style={style}
    >
      <Animated.View style={[animatedStyle]} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const GOOGLE_MAPS_APIKEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MapProps = {
  locations: Place[];
  selectedPlace: Place | null;
  showRoute: boolean;
  onMarkerPress?: (place: Place) => void;
};

export default function Map({ locations, selectedPlace, showRoute, onMarkerPress }: MapProps) {

  const mapRef = useRef<MapView>(null);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showTileOverlay, setShowTileOverlay] = useState(true);
  
  // Hooks de animación que respetan el modo de rendimiento
  const { animatedValue: overlayOpacity, animateWithTiming: animateOpacity } = usePerformantAnimation(0);
  const { animatedValue: overlayScale, animateWithTiming: animateScale } = usePerformantAnimation(0.8);

  const [region, setRegion] = useState({
    latitude: -12.044345,
    longitude: -76.952688,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Conservar rotacion al animar a ubicacion
  const animateToLocation = (location: { latitude: number; longitude: number }) => {
    mapRef.current?.animateCamera({
      center: { latitude: location.latitude, longitude: location.longitude }
    }, { duration: 1000 });
  }

  const showImageOverlayWithAnimation = () => {
    setShowImageOverlay(true);
    animateOpacity(1, { duration: 300 });
    animateScale(1, { duration: 300 });
  };

  const hideImageOverlayWithAnimation = () => {
    animateOpacity(0, { duration: 300 });
    animateScale(0.8, { duration: 300 });
    setTimeout(() => setShowImageOverlay(false), 300);
  };

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  const tecsupGroundOverlayBounds = {
    southWest: { latitude: -12.045581, longitude: -76.953785 },
    northEast: { latitude: -12.043138, longitude: -76.951569 }, 
  };

  const toggleTileOverlay = () => {
    setShowTileOverlay(!showTileOverlay);
  };



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

    // // Tecsup limits
    // if (mapRef.current) {
    //   mapRef.current.setMapBoundaries(
    //     tecsupGroundOverlayBounds.northEast,
    //     tecsupGroundOverlayBounds.southWest
    //   )
    // }
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
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="hybrid"
      >
        {/* Overlay del plano del campus en alta definición */}
        {/* {showTileOverlay && (
          <Overlay
            bounds={[
              [tecsupGroundOverlayBounds.southWest.latitude, tecsupGroundOverlayBounds.southWest.longitude],
              [tecsupGroundOverlayBounds.northEast.latitude, tecsupGroundOverlayBounds.northEast.longitude],
            ]}
            image={{
              // Reemplaza con tu imagen del plano del campus
              uri: 'https://i.pinimg.com/736x/0f/2d/f3/0f2df35f5f8ef2f325cc8719326749dc.jpg'
              // Para mejor calidad, usa una imagen local:
              // uri: require('@assets/images/tecsup-campus-plan-hd.png')
            }}
            // Opacidad dinámica según el zoom
            opacity={region.latitudeDelta < 0.003 ? 0.8 : 0.6}
            // Configuración adicional para mejor renderizado
            bearing={-24} // Rotación en grados si es necesaria
          />
        )} */}

        {locations?.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitud, longitude: loc.longitud }}
            onPress={() => {
              // Llamar al callback para abrir PlaceInfoCard
              onMarkerPress?.(loc);
              
              // Mantener funcionalidad de imagen si existe
              if (loc.imagen) {
                showImageOverlayWithAnimation();
              }
            }}
          />
        ))}

        {/* Ruta de navegación */}
        {/* {userLocation && selectedPlace && showRoute && (
          <MapViewDirections
            origin={userLocation}
            destination={{
              latitude: selectedPlace.latitud,
              longitude: selectedPlace.longitud,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="cyan" 
            mode="WALKING"
            optimizeWaypoints={true}
          />
        )} */}
      </MapView>

      {/* Controles del overlay mejorados */}
      {/* <View className="absolute top-15 right-5 space-y-2">

        <TouchableOpacity 
          className="bg-tecsup-cyan px-3 py-2.5 rounded-2xl flex-row items-center shadow-lg"
          onPress={toggleTileOverlay}
        >
          <Ionicons 
            name={showTileOverlay ? "eye-off" : "eye"} 
            size={20} 
            color="#fff" 
          />
          <Text className="text-white text-xs font-semibold ml-1.5">
            {showTileOverlay ? "Ocultar Plano" : "Mostrar Plano"}
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* Modal de imagen mejorado */}
      <Modal
        visible={showImageOverlay}
        transparent={true}
        animationType="none"
        onRequestClose={hideImageOverlayWithAnimation}
      >
        <View className="flex-1 justify-center items-center bg-black/80">
          <AnimatedButton
            className="absolute inset-0"
            activeOpacity={1}
            onPress={hideImageOverlayWithAnimation}
          >
            <View />
          </AnimatedButton>

          <Animated.View 
            style={[overlayAnimatedStyle]}
            className="w-[90%] max-h-[80%] bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <AnimatedButton
              className="absolute top-3 right-3 z-10 bg-black/60 rounded-2xl w-10 h-10 justify-center items-center"
              onPress={hideImageOverlayWithAnimation}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </AnimatedButton>

            {selectedPlace?.imagen && (
              <Image
                source={{ uri: selectedPlace.imagen }}
                className="w-full bg-neutral-100"
                style={{ height: SCREEN_HEIGHT * 0.5 }}
                contentFit="cover"
                placeholder={require('@assets/images/placeholder-image.webp')}
                transition={200}
              />
            )}

            <View className="p-4 bg-white">
              <Text className="text-xl font-bold text-neutral-800 mb-2">{selectedPlace?.nombre}</Text>
              <Text className="text-sm text-neutral-600 leading-5">{selectedPlace?.descripcion}</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}