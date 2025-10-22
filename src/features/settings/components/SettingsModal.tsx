import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { usePerformantAnimation, useButtonScale } from '../../../shared/hooks/usePerformantAnimation';
import { useAppSettings } from '../../../shared/context/AppSettingsContext';

import SettingsModalBody from './SettingsModalBody';
import SettingsModalHeader from './SettingsModalHeader';
import Backdrop from '@components/Backdrop';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onViewProfile?: () => void;
}

const MODAL_HEIGHT = 400; 

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { settings, updateSetting } = useAppSettings();
  const [shouldRender, setShouldRender] = useState(false);

  const { animatedValue: overlayOpacity, animateWithTiming: animateOpacity } = usePerformantAnimation(0);
  const { animatedValue: translateY, animateWithTiming: animateTranslateY } = usePerformantAnimation(MODAL_HEIGHT);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      setTimeout(() => {
        animateOpacity(1, { duration: 300 });
        animateTranslateY(0, { duration: 300 });
      }, 50);
    } else if (shouldRender) {
      animateOpacity(0, { duration: 250 });
      animateTranslateY(MODAL_HEIGHT, { duration: 300 });

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [visible, shouldRender, animateOpacity, animateTranslateY]);

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
      <Backdrop />

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

        {/* Header */}
        <SettingsModalHeader onClose={onClose} />

        {/* Content */}
        <SettingsModalBody
          settings={settings}
          updateSetting={updateSetting}
          onClose={onClose}
          handleLogout={handleLogout}
        />
      </Animated.View>
    </View>
  );
};