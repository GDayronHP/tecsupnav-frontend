import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Place } from '@types/place';
import type { Option } from '@types/aiAssistant';

interface ChatBotOptionsProps {
  places?: Place[];
  options?: Option[];
  selectedPlace?: Place;
  onPlaceSelect?: (place: Place) => void;
  onOptionSelect?: (option: Option, place?: Place) => void;
}

export const ChatBotOptions: React.FC<ChatBotOptionsProps> = ({
  places,
  options,
  selectedPlace,
  onPlaceSelect,
  onOptionSelect,
}) => {
  // Si no hay lugares ni opciones, no mostramos nada
  if (!places?.length && !options?.length) return null;

  // Si hay un lugar seleccionado, mostramos las opciones
  if (selectedPlace && options?.length) {
    return (
      <View className="mt-2 space-y-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onOptionSelect?.(option, selectedPlace)}
            className="flex-row items-center bg-neutral-100 p-3 rounded-xl"
            activeOpacity={0.7}
          >
            <View className="bg-cyan-50 p-2 rounded-full mr-3">
              <Ionicons
                name={option.id === 'view' ? 'eye-outline' : 'navigate-outline'}
                size={20}
                color="#00BCD4"
              />
            </View>
            <View className="flex-1">
              <Text className="text-subtitle text-neutral-900 font-medium">
                {option.label}
              </Text>
              {option.description && (
                <Text className="text-caption text-neutral-500">
                  {option.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Por defecto, mostramos la lista de lugares
  return (
    <View className="mt-2 space-y-2">
      {places?.map((place) => (
        <TouchableOpacity
          key={place.id}
          onPress={() => onPlaceSelect?.(place)}
          className="flex-row items-center bg-neutral-100 p-3 rounded-xl"
          activeOpacity={0.7}
        >
          <View className="bg-cyan-50 p-2 rounded-full mr-3">
            <Ionicons name="location-sharp" size={20} color="#00BCD4" />
          </View>
          <View className="flex-1">
            <Text className="text-subtitle text-neutral-900 font-medium">
              {place.nombre}
            </Text>
            <Text className="text-caption text-neutral-500">
              {`${place.edificio}, Piso ${place.piso}`}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};