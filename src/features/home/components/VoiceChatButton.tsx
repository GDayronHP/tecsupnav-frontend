import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceChatButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({
  onTranscription,
  className = ""
}) => {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  const {
    isListening,
    transcription,
    error,
    startListening,
    stopListening,
    resetState
  } = useSpeechToText();

  useEffect(() => {
    if (isListening) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      
      colorProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
      colorProgress.value = withTiming(0, { duration: 300 });
    }
  }, [isListening]);

  useEffect(() => {
    if (transcription && !isListening) {
      onTranscription(transcription);
      resetState();
    }
  }, [transcription, isListening, onTranscription, resetState]);

  useEffect(() => {
    if (error) {
      console.log('Voice recognition error:', error);
      resetState();
    }
  }, [error, resetState]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#6b7280', '#ef4444']
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isListening ? backgroundColor : '#6b7280',
    };
  });

  const handlePress = async () => {
    if (isListening) {
      stopListening();
    } else {
      resetState();
      await startListening();
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      className={`w-8 h-8 rounded-full justify-center items-center ${className}`}
      style={animatedStyle}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isListening ? "stop" : "mic"}
        size={16}
        color="white"
      />
    </AnimatedTouchableOpacity>
  );
};

export default VoiceChatButton;