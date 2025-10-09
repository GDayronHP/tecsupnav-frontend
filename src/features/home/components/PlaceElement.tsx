import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useButtonScale } from '../../../shared/hooks/usePerformantAnimation';

// Botón animado para acciones de lugar
const AnimatedActionButton = ({ children, onPress, className }: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
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
      activeOpacity={1}
      className='flex-1'
    >
      <Animated.View style={[animatedStyle]} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

type PlaceElementProps = {
  location: any;
  index: number;
  filteredLocations: any[];
  color: string;
  handleLocationView: (location: any) => void;
  handleLocationRoute: (location: any) => void;
};

export default function PlaceElement({ location, index, filteredLocations, color, handleLocationView, handleLocationRoute }: PlaceElementProps) {
  return (
    <View key={location.id} className="mb-4">
      {/* Location Info */}
      <View className="mb-2">
        <Text className="text-subtitle text-tecsup-text-primary font-medium mb-1">
          {location.nombre}
        </Text>
        <View className="flex-row items-center">
          <View
            className={`px-2 py-1 rounded-base mr-2 bg-[${color}]`}
          >
            <Text className="text-xs font-medium">{location.tipo.nombre}</Text>
          </View>
          <Text className="text-tecsup-text-muted text-caption">
            • Piso {location.piso}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <AnimatedActionButton
          className="flex-1 bg-tecsup-surface py-3 rounded-button flex-row items-center justify-center"
          onPress={() => handleLocationView(location)}
        >
          <Ionicons name="eye" size={16} color="#0ea5e9" />
          <Text className="text-tecsup-text-link text-label ml-2">
            Ver
          </Text>
        </AnimatedActionButton>

        <AnimatedActionButton 
          className="flex-1 bg-tecsup-cyan py-3 rounded-button flex-row items-center justify-center"
          onPress={() => handleLocationRoute(location)}
        >
          <Ionicons name="navigate" size={16} color="white" />
          <Text className="text-white text-label ml-2">Ruta</Text>
        </AnimatedActionButton>
      </View>

      {/* Separator */}
      {index !== filteredLocations.length - 1 && (
        <View className="border-b border-neutral-100 mt-3" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({})