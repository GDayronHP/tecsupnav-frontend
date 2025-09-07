import React, { useRef, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  TouchableWithoutFeedback,
  Easing
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "@/types/place";

interface PlaceInfoCardProps {
  place: Place;
  isVisible: boolean;
  onClose: () => void;
  onRoutePress?: () => void;
  onDetailsPress?: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const PlaceInfoCard: React.FC<PlaceInfoCardProps> = ({ 
  place, 
  isVisible,
  onClose,
  onRoutePress, 
  onDetailsPress 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      // Animación de entrada (slide suave, sin bounce)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (visible) {
      // Animación de salida (slide suave hacia abajo)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }
  }, [isVisible]);

  if (!place || !visible) return null;

  return (
    <Animated.View 
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          opacity: fadeAnim,
        }
      ]}
    >
      {/* Overlay oscuro */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />
      </TouchableWithoutFeedback>

      {/* Contenido del modal */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Indicador de arrastre */}
        <View className="bg-white rounded-t-3xl pt-2 pb-0">
          <TouchableOpacity 
            onPress={onClose}
            className="items-center py-2"
            activeOpacity={0.7}
          >
            <View className="w-12 h-1.5 bg-neutral-300 rounded-full" />
          </TouchableOpacity>
        </View>

        {/* Contenido principal */}
        <View className="bg-white px-6 pb-8">
          {/* Header con botón de cerrar */}
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

          {/* Descripción */}
          {place.descripcion && (
            <View className="mb-4">
              <Text className="text-base text-neutral-700 leading-6">
                {place.descripcion}
              </Text>
            </View>
          )}

          {/* Información adicional */}
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

          {/* Botones de acción */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-cyan-500 py-4 rounded-2xl items-center shadow-sm"
              onPress={onRoutePress}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text className="text-white text-base font-semibold ml-2">
                  Obtener Ruta
                </Text>
              </View>
            </TouchableOpacity>
            
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default PlaceInfoCard;