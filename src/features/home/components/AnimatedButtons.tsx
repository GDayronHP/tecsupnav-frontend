import { useButtonScale } from '@hooks/usePerformantAnimation';
import { TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const AnimatedChatButton = ({ children, onPress, className, style }: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: any;
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
      style={style}
    >
      <Animated.View style={[animatedStyle]} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedButton = ({ children, onPress, className, style, activeOpacity }: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: any;
  activeOpacity?: number;
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
      activeOpacity={activeOpacity || 1}
      style={style}
    >
      <Animated.View style={[animatedStyle]} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedCloseButton = ({ onPress }: { onPress: () => void }) => {
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
      <Animated.View style={animatedStyle}>
        <Ionicons name="close" size={24} color="#6b7280" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export { AnimatedChatButton, AnimatedButton, AnimatedCloseButton };
