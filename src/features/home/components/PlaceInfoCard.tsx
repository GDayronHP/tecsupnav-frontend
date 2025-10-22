import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Pressable,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { usePerformantAnimation } from '../../../shared/hooks/usePerformantAnimation';
import { Place } from "../../../types/place";
import { Navigation } from "../../../types/navigation";

interface PlaceInfoCardProps {
  place: Place;
  isVisible: boolean;
  onClose: () => void;
  onRoutePress?: () => void;
  realTimeNavigation?: boolean;
  navigationData?: Navigation;
  modalKey?: number; // Agregar prop para forzar re-renders
}

const { height: screenHeight } = Dimensions.get('window');
const placeholderImage = require('@assets/images/placeholder-image.webp');

const PlaceInfoCard: React.FC<PlaceInfoCardProps> = ({
  place,
  isVisible,
  onClose,
  onRoutePress,
  realTimeNavigation = false,
  navigationData,
}) => {
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hooks de animación que respetan el modo de rendimiento
  const { animatedValue: fadeAnim, animateWithTiming: animateFade } = usePerformantAnimation(0);
  const { animatedValue: slideAnim, animateWithTiming: animateSlide, animateWithCallback: animateSlideWithCallback } = usePerformantAnimation(screenHeight);

  // Estilos animados
  const fadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  useEffect(() => {
    if (isVisible && place) {
      setIsAnimating(true);
      setVisible(true);
      
      // Resetear animaciones primero
      fadeAnim.value = 0;
      slideAnim.value = screenHeight;
      
      // Animar entrada con un pequeño delay para asegurar que el componente esté montado
      const timeout = setTimeout(() => {
        animateFade(1, { duration: 300 });
        animateSlide(0, { duration: 300 });
        setTimeout(() => setIsAnimating(false), 300);
      }, 50);
      
      return () => clearTimeout(timeout);
      
    } else if (!isVisible && visible) {
      setIsAnimating(true);
      
      // Animar salida
      animateFade(0, { duration: 250 });
      animateSlideWithCallback(screenHeight, { duration: 300 }, () => {
        setVisible(false);
        setIsAnimating(false);
      });
    }
  }, [isVisible, place?.id]);

  if (!place) {
    return null;
  }

  if (!visible && !isAnimating) {
    return null;
  }

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 bottom-0"
      style={[
        fadeAnimatedStyle,
        {
          zIndex: 9999,
          elevation: 9999,
        }
      ]}
      pointerEvents={visible || isAnimating ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        className="absolute bottom-0 left-0 right-0"
        style={[
          slideAnimatedStyle,
          {
            zIndex: 2,
            elevation: 10,
          }
        ]}
      >
        <View className="bg-white rounded-t-3xl pt-2 pb-0">
          <TouchableOpacity
            onPress={onClose}
            className="items-center py-2"
            activeOpacity={0.7}
          >
            <View className="w-12 h-1.5 bg-neutral-300 rounded-full" />
          </TouchableOpacity>
        </View>

        {/* Header with information */}
        <View className="bg-white px-6 pb-8">
          {realTimeNavigation ? (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <View className="w-3 h-3 bg-primary-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-label text-neutral-900 font-semibold">
                      Navegando hacia
                    </Text>
                    <Text className="text-subtitle text-neutral-800 font-semibold">
                      {navigationData?.destination.nombre || 'Sin ubicación'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View className="flex-row">
                <View className="flex-1 bg-neutral-50 rounded-card p-4 mr-3">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-caption text-neutral-500 font-medium ml-2">
                      Tiempo
                    </Text>
                  </View>
                  <Text className="text-subtitle text-neutral-900 font-semibold">
                    {navigationData?.route.tiempoEstimado + " min" || 'Sin datos'}
                  </Text>
                </View>

                <View className="flex-1 bg-neutral-50 rounded-card p-4">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-caption text-neutral-500 font-medium ml-2">
                      Distancia
                    </Text>
                  </View>
                  <Text className="text-subtitle text-neutral-900 font-semibold">
                    {navigationData?.route.distancia.toFixed(0) + " m" || 'Sin datos'}
                  </Text>
                </View>
              </View>
            </>

          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <View className="bg-cyan-50 p-2 rounded-full mr-3">
                    <Ionicons name="location-sharp" size={24} color="#00BCD4" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-neutral-800">
                      {place.nombre}
                    </Text>
                    <Text className="text-sm text-neutral-500 mt-1">
                      {place.tipo?.nombre}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="p-2 bg-neutral-100 rounded-full ml-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View className="h-40 rounded-xl overflow-hidden my-2" >
                <View className="w-full items-center justify-center mb-4 bg-gray-100 rounded-xl">
                  {place.imagen ? (
                    <Image
                      source={{ uri: place.imagen }}
                      style={{ width: 220, height: 160, borderRadius: 16, resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }}
                    />
                  ) : (
                    <Image
                      source={placeholderImage}
                      style={{ width: 220, height: 160, borderRadius: 16, resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }}
                    />
                  )}
                </View>
              </View>

              {place.descripcion && (
                <View className="mb-4">
                  <Text className="text-base text-neutral-700 leading-6">
                    {place.descripcion}
                  </Text>
                </View>
              )}

              <View className="bg-neutral-50 rounded-xl p-4 mb-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="map-outline" size={16} color="#6B7280" />
                  <Text className="text-sm text-neutral-600 ml-2 font-medium">
                    Coordenadas
                  </Text>
                </View>
                <Text className="text-sm text-neutral-500 ml-6">
                  {place.latitud}, {place.longitud}
                </Text>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-cyan-500 py-4 rounded-2xl items-center shadow-sm"
                  onPress={onRoutePress}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="navigate" size={20} color="#fff" />
                    <Text className="text-white text-base font-semibold ml-2">
                      Iniciar
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
            </>
          )}

        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default PlaceInfoCard;