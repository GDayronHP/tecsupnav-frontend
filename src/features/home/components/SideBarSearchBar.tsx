import { View, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useButtonScale } from '../../../shared/hooks/usePerformantAnimation';

// Botón animado para limpiar búsqueda
const AnimatedClearButton = ({ onPress }: { onPress: () => void }) => {
  const { scale, scaleDown, scaleUp } = useButtonScale();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <TouchableOpacity
      onPressIn={scaleDown}
      onPressOut={scaleUp}
      onPress={onPress}
      className="ml-2"
      activeOpacity={1}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons name="close-circle" size={20} color="#94a3b8" />
      </Animated.View>
    </TouchableOpacity>
  );
};

type SearchBarProps = {
    setSearchText: (text: string) => void;
    searchText: string;
}

export default function SearchBar({ setSearchText, searchText }: SearchBarProps) {

    const clearSearch = () => {
        setSearchText('');
    };

    return (
        <View className="flex-row items-center bg-tecsup-input-bg rounded-input px-3 py-2">
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar aulas, laboratorios, servicios..."
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-3 text-tecsup-text-primary text-body"
            />
            {searchText.length > 0 && (
                <AnimatedClearButton onPress={clearSearch} />
            )}
        </View>
    )
}