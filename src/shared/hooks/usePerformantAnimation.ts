import { useSharedValue, withSpring, withTiming, WithSpringConfig, WithTimingConfig, runOnJS } from 'react-native-reanimated';
import { useAppSettings } from '../context/AppSettingsContext';

export const usePerformantAnimation = (initialValue: number = 0) => {
  const { isPerformanceModeEnabled } = useAppSettings();
  const animatedValue = useSharedValue(initialValue);

  const animateWithSpring = (
    toValue: number,
    config?: WithSpringConfig,
    callback?: (finished?: boolean) => void
  ) => {
    if (isPerformanceModeEnabled) {
      // En modo rendimiento, cambiar instantáneamente sin animación
      animatedValue.value = toValue;
      if (callback && typeof callback === 'function') {
        // Usar setTimeout para evitar problemas con runOnJS anidado
        setTimeout(() => {
          try {
            callback(true);
          } catch (error) {
            console.warn('Error executing animation callback:', error);
          }
        }, 0);
      }
    } else {
      // Animación normal con spring
      animatedValue.value = withSpring(toValue, config, callback);
    }
  };

  const animateWithTiming = (
    toValue: number,
    config?: WithTimingConfig,
    callback?: (finished?: boolean) => void
  ) => {
    if (isPerformanceModeEnabled) {
      // En modo rendimiento, cambiar instantáneamente sin animación
      animatedValue.value = toValue;
      if (callback && typeof callback === 'function') {
        // Usar setTimeout para evitar problemas con runOnJS anidado
        setTimeout(() => {
          try {
            callback(true);
          } catch (error) {
            console.warn('Error executing animation callback:', error);
          }
        }, 0);
      }
    } else {
      // Animación normal con timing
      animatedValue.value = withTiming(toValue, config, callback);
    }
  };

  // Función específica para animaciones que necesitan ejecutar una acción al final
  const animateWithCallback = (
    toValue: number,
    config?: WithTimingConfig,
    onComplete?: () => void
  ) => {
    if (isPerformanceModeEnabled) {
      // En modo rendimiento, cambiar instantáneamente y ejecutar callback
      animatedValue.value = toValue;
      if (onComplete) {
        setTimeout(onComplete, 0);
      }
    } else {
      // Animación normal con timing y callback usando timeout
      animatedValue.value = withTiming(toValue, config);
      if (onComplete) {
        const duration = config?.duration || 300;
        setTimeout(onComplete, duration);
      }
    }
  };

  return {
    animatedValue,
    animateWithSpring,
    animateWithTiming,
    animateWithCallback,
    isPerformanceModeEnabled,
  };
};

// Hook para botones con efecto de escala
export const useButtonScale = () => {
  const { isPerformanceModeEnabled } = useAppSettings();
  const scale = useSharedValue(1);

  const scaleDown = () => {
    if (isPerformanceModeEnabled) {
      scale.value = 0.95;
    } else {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }
  };

  const scaleUp = () => {
    if (isPerformanceModeEnabled) {
      scale.value = 1;
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  return {
    scale,
    scaleDown,
    scaleUp,
    isPerformanceModeEnabled,
  };
};