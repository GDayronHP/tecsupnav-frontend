import React from "react";
import { ActivityIndicator } from "react-native";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function LoadingScreen() {
  return (
    <View className="flex-1 bg-tecsup-surface justify-center items-center">
      <View className="items-center">
        <View className="w-20 h-20 rounded-[20px] bg-primary-500 justify-center items-center mb-6 shadow-card">
          <Ionicons name="location" size={48} color="white" />
        </View>

        <Text className="text-[20px] font-semibold text-neutral-700 mb-2">
          Localizando en Tecsup
        </Text>

        <Text className="text-body text-neutral-500 mb-8">
          Conectando con el sistema del campus
        </Text>

        <ActivityIndicator size="large" color="#00BCD4" style={{ transform: [{ scale: 1.2 }] }} />
      </View>
    </View>
  );
}

export default LoadingScreen;
