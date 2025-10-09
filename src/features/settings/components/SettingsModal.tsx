import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { usePerformantAnimation, useButtonScale } from '../../../shared/hooks/usePerformantAnimation';
import { useAppSettings } from '../../../shared/context/AppSettingsContext';
import Switch from '@components/Switch';

// Componente de botón animado para el modal
const AnimatedButton = ({ children, onPress, className }: {
  children: React.ReactNode;
  onPress?: () => void;
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
    >
      <Animated.View style={[animatedStyle]} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onViewProfile?: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { settings, updateSetting } = useAppSettings();
  const [shouldRender, setShouldRender] = useState(false);

  const { animatedValue: overlayOpacity, animateWithTiming: animateOpacity } = usePerformantAnimation(0);
  const { animatedValue: translateY, animateWithTiming: animateTranslateY } = usePerformantAnimation(400);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      setTimeout(() => {
        animateOpacity(1, { duration: 300 });
        animateTranslateY(0, { duration: 300 });
      }, 50);
    } else if (shouldRender) {
      animateOpacity(0, { duration: 250 });
      animateTranslateY(300, { duration: 300 });

      setTimeout(() => {
        setShouldRender(false);
      }, 350);
    }
  }, [visible, shouldRender, animateOpacity, animateTranslateY]);


  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const translateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            onClose();
            router.push('/auth');
          },
        },
      ]
    );
  };

  if (!shouldRender) return null;

  return (
    <View className="flex-1 absolute bottom-0 left-0 right-0 top-0 z-20">
      {/* Fondo animado con opacidad - no cubre las tabs */}
      <Animated.View
        className="absolute bg-black/50"
        style={[
          overlayAnimatedStyle,
          {
            top: 0,
            left: 0,
            right: 0,
            bottom: 60,
          }
        ]}
      />

      {/* Área de cierre */}
      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Modal deslizable con animación */}
      <Animated.View
        className="bg-white rounded-t-3xl w-full shadow-2xl"
        style={[
          translateAnimatedStyle,
          {
            marginBottom: 60,
            maxHeight: '80%'
          }
        ]}
      >
        {/* Handle indicator */}
        <View className="w-12 h-1 bg-neutral-300 rounded-full self-center mt-3 mb-2" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
          <View className="flex-row items-center gap-2">
            <Ionicons name="settings-outline" size={20} color="#00BCD4" />
            <Text className="text-lg font-semibold text-neutral-900">Configuración</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="text-neutral-400"
          >
            <Ionicons name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-4 pb-6">
          {/* Perfil Section */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-neutral-600 my-3">Perfil</Text>
            <View className="bg-primary-50 rounded-xl p-4 flex-row items-center justify-between h-fit">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-primary-500 rounded-full justify-center items-center">
                  <Ionicons name="person-circle" size={32} color="white" />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-neutral-900">Estudiante Tecsup</Text>
                  <Text className="text-xs text-neutral-500">Joseph Huayra Puma</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  router.push('/profile');
                }}
                className="rounded-lg bg-primary-100 py-2 px-4"
              >
                <Text className="text-primary-500 text-sm font-medium text-center">Ver perfil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferencias Section */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-neutral-600 mb-3">Preferencias</Text>

            {/* Notificaciones Toggle */}
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
                <Text className="text-sm text-neutral-700">Notificaciones</Text>
              </View>
              <Switch
                isOn={settings.notifications}
                onToggle={() => updateSetting('notifications', !settings.notifications)}
              />
            </View>

            {/* Ubicación en tiempo real Toggle */}
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                <Text className="text-sm text-neutral-700">Ubicación en tiempo real</Text>
              </View>

              {/* Usar el componente switch de reemplazo */}
              <Switch
                isOn={settings.location}
                onToggle={() => updateSetting('location', !settings.location)}
              />
            </View>
          </View>

          {/* Cerrar Sesión Button */}
          <AnimatedButton
            onPress={handleLogout}
            className="w-full bg-error-500 py-3 px-4 rounded-xl flex-row items-center justify-center gap-2"
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-medium">Cerrar sesión</Text>
          </AnimatedButton>
        </View>
      </Animated.View>
    </View>
  );
};