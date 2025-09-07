import { Text, View } from "react-native";
import React from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Modal, TouchableOpacity } from "react-native";

export default function PermissionModal ({
  setIsLoading,
  setShowMainScreen,
  showPermissionModal,
  setShowPermissionModal,
  dontAskAgain,
  setDontAskAgain,
}){
  const requestLocationPermission = async () => {
    try {
      setShowPermissionModal(false);
      setIsLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setTimeout(() => {
          setIsLoading(false);
          setShowMainScreen(true);
        }, 3000);
      } else {
        setIsLoading(false);
        Alert.alert(
          "Permisos requeridos",
          "Para usar esta función necesitamos acceso a tu ubicación.",
          [
            {
              text: "Intentar de nuevo",
              onPress: () => setShowPermissionModal(true),
            },
            {
              text: "Continuar sin ubicación",
              onPress: () => setShowMainScreen(true),
            },
          ]
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error requesting location permission:", error);
    }
  };

  const handleReject = () => {
    setShowPermissionModal(false);
    setShowMainScreen(true);
  };

  return (
    <Modal visible={showPermissionModal} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-card mx-8 p-6 items-center shadow-card">
          <View className="items-center mb-5">
            <View className="w-10 h-10 rounded-md bg-primary-500 justify-center items-center mb-4">
              <Ionicons name="location" size={24} color="white" />
            </View>
            <Text className="text-base text-neutral-700 text-center leading-[22px]">
              ¿Permitir que{" "}
              <Text className="font-semibold text-primary-500">TecsupNav</Text>
            </Text>
            <Text className="text-base text-neutral-700 text-center">
              acceda a la ubicación de este dispositivo?
            </Text>
          </View>

          <View className="self-stretch mb-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setDontAskAgain(!dontAskAgain)}
            >
              <View
                className={`w-[18px] h-[18px] border-2 rounded-sm mr-2 justify-center items-center ${
                  dontAskAgain
                    ? "bg-primary-500 border-primary-500"
                    : "border-neutral-600"
                }`}
              >
                {dontAskAgain && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-caption text-neutral-500">
                No volver a preguntar
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row self-stretch justify-end space-x-4">
            <TouchableOpacity onPress={handleReject} className="py-2 px-4">
              <Text className="text-label font-semibold text-neutral-500">
                RECHAZAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={requestLocationPermission} className="py-2 px-4">
              <Text className="text-label font-semibold text-primary-500">
                PERMITIR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
