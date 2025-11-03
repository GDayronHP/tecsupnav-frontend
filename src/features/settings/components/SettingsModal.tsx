import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert} from 'react-native';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { usePerformantAnimation, useButtonScale } from '../../../shared/hooks/usePerformantAnimation';
import { useAppSettings } from '../../../shared/context/AppSettingsContext';

import SettingsModalBody from './SettingsModalBody';
import SettingsModalHeader from './SettingsModalHeader';
import Backdrop from '@components/Backdrop';
import authService from '@features/auth/services/authService';

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

  const handleLogout = async() => {
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
          onPress: async () => {
            onClose();
            await authService.logout();
            router.push('/auth');
          },
        },
      ]
    );
  };

  if (!shouldRender) return null;

  return (
    <View className="flex-1 absolute bottom-0 left-0 right-0 top-0 z-20">
      <Backdrop />

      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={onClose}
      />

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

        <SettingsModalHeader onClose={onClose} />

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