import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  StatusBar,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { usePerformantAnimation } from '../../../shared/hooks/usePerformantAnimation';
import { useSettingsStore } from "@/stores";
import Backdrop from "@components/Backdrop";

const emergencyContacts = [
  {
    id: 1,
    name: "Tópico",
    phone: "(+51) 940457085",
  },
  {
    id: 2,
    name: "Vigilancia",
    phone: "(+51) 922480116",
  },
  {
    id: 3,
    name: "Pedro Flores",
    phone: "(+51) 955921535",
  },
];

const EmergencyContactsModal = ({ visible, onClose }) => {
  // Hook de animación que respeta el modo de rendimiento
  const { animatedValue: overlayOpacity, animateWithTiming: animateOverlayOpacity } = usePerformantAnimation(0);
  
  // Selective subscription - only get performanceMode
  const performanceMode = useSettingsStore(s => s.performanceMode);
  const settings = { performanceMode };

  // Estilo animado para el overlay
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  useEffect(() => {
    if (visible) {
      animateOverlayOpacity(1, { duration: 300 });
    } else {
      animateOverlayOpacity(0, { duration: 0 });
    }
  }, [visible, animateOverlayOpacity]);

  const makeCall = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
    const phoneUrl = `tel:${cleanPhone}`;

    Alert.alert("Realizar llamada", `¿Deseas llamar a ${phoneNumber}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Llamar",
        onPress: () => {
          Linking.openURL(phoneUrl).catch((err) => {
            Alert.alert("Error", "No se pudo realizar la llamada");
            console.error("Error making call:", err);
          });
        },
      },
    ]);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay animado */}
      <Backdrop />

      <Modal
        visible={visible}
        animationType={settings.performanceMode ? "none" : "fade"}
        transparent={true}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
        onRequestClose={onClose}
        style={{ zIndex: 9999 }}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
        <SafeAreaView className="flex-1 justify-center px-5">
          <View className="bg-white rounded-card shadow-card-hover max-w-[400px] self-center w-full">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-200">
              <View className="flex-row items-center flex-1">
                <View className="w-6 h-6 justify-center items-center mr-3">
                  <Ionicons name="warning" size={20} color="#dc2626" />
                </View>
                <Text className="text-subtitle font-semibold text-error-600">
                  Contactos de Emergencia
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 justify-center items-center"
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="px-4 py-4">
              {emergencyContacts.map((contact, index) => (
                <View
                  key={contact.id}
                  className={`flex-row items-center justify-between py-4 ${
                    index !== emergencyContacts.length - 1 ? 'border-b border-neutral-100' : ''
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-body font-semibold text-neutral-800 mb-1">
                      {contact.name}
                    </Text>
                    <Text className="text-label text-neutral-500">
                      {contact.phone}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => makeCall(contact.phone)}
                    className="flex-row items-center bg-tecsup-cyan/10 border border-tecsup-cyan/20 px-4 py-2 rounded-full ml-3"
                  >
                    <Ionicons
                      name="call"
                      size={16}
                      color="#00bcd4"
                      className="mr-1"
                    />
                    <Text className="text-tecsup-cyan font-medium text-label ml-1">
                      Llamar
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default EmergencyContactsModal;
