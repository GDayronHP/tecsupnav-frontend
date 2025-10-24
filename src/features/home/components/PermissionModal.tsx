import { Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Modal, TouchableOpacity } from "react-native";

import { usePlaces } from "@context/PlacesContext";

export default function PermissionModal({
  setIsLoading,
  setShowMainScreen,
  showPermissionModal,
  setShowPermissionModal,
  dontAskAgain,
  setDontAskAgain,
}) {

  const { gpsStatus, setGpsStatus } = usePlaces();

  useEffect(() => {
    const checkExistingPermissions = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (status === 'granted') {
          console.log('✅ Permisos de ubicación ya otorgados');
          setGpsStatus('granted');
          setShowPermissionModal(false);
          setShowMainScreen(true);
          setIsLoading(false);
        } else if (status === 'denied') {
          console.log('❌ Permisos de ubicación denegados');
          setGpsStatus('denied');
          
          setShowPermissionModal(true);
        } else {
          console.log('⚠️ Permisos de ubicación indeterminados');
          setGpsStatus('undetermined');
          
          setShowPermissionModal(true);
        }
      } catch (error) {
        console.error('Error verificando permisos de ubicación:', error);
        setShowPermissionModal(true);
      }
    };

    if (gpsStatus === 'undetermined' || showPermissionModal) {
      checkExistingPermissions();
    } else if (gpsStatus === 'granted') {
      
      setShowPermissionModal(false);
      setShowMainScreen(true);
      setIsLoading(false);
    }
  }, [gpsStatus, showPermissionModal, setGpsStatus, setShowMainScreen, setShowPermissionModal, setIsLoading]);

  const requestLocationPermission = async () => {
    try {
      setShowPermissionModal(false);
      setIsLoading(true);

      console.log('🔄 Solicitando permisos de ubicación...');
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        console.log('✅ Permisos de ubicación concedidos');
        setGpsStatus('granted');
        setIsLoading(false);
        setShowMainScreen(true);
      } else {
        console.log('❌ Permisos de ubicación denegados por el usuario');
        setGpsStatus('denied');
        setIsLoading(false);
        Alert.alert(
          "Permisos requeridos",
          "Para usar TecsupNav necesitamos acceso a tu ubicación para mostrarte lugares cercanos y rutas de navegación.",
          [
            {
              text: "Intentar de nuevo",
              onPress: () => setShowPermissionModal(true),
            },
            {
              text: "Continuar sin ubicación",
              onPress: () => {
                setShowMainScreen(true);
                setGpsStatus('denied');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setIsLoading(false);
      setGpsStatus('denied');
      Alert.alert(
        "Error",
        "Ocurrió un error al solicitar permisos de ubicación. Inténtalo nuevamente.",
        [
          {
            text: "Reintentar",
            onPress: () => setShowPermissionModal(true),
          },
          {
            text: "Continuar sin ubicación",
            onPress: () => setShowMainScreen(true),
          },
        ]
      );
    }
  };

  const handleReject = () => {
    console.log('❌ Usuario rechazó permisos de ubicación');
    setShowPermissionModal(false);
    setGpsStatus('denied');
    setIsLoading(false);
    
    Alert.alert(
      "Permisos denegados",
      "Sin acceso a la ubicación, algunas funciones de TecsupNav pueden estar limitadas. Puedes activar los permisos más tarde desde la configuración de tu dispositivo.",
      [
        {
          text: "Continuar sin ubicación",
          onPress: () => {
            setShowMainScreen(true);
          },
        },
        {
          text: "Dar permisos",
          onPress: () => {
            setShowPermissionModal(true);
          },
        },
      ]
    );
  };

  // No mostrar el modal si ya tiene permisos concedidos
  if (gpsStatus === 'granted') {
    return null;
  }

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
                className={`w-[18px] h-[18px] border-2 rounded-sm mr-2 justify-center items-center ${dontAskAgain
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
