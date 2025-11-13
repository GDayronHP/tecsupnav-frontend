import React, { useEffect, useState, useCallback } from 'react';
import { useVoiceRecognition } from '../../../shared/context/VoiceRecognitionContext';
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
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface VoiceChatButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
  instanceId?: string;
  disabled?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({
  onTranscription,
  className = "",
  instanceId = "default"
}) => {
  const { activeInstanceId, setActiveInstance } = useVoiceRecognition();
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasReceivedResult, setHasReceivedResult] = useState(false);

  useSpeechRecognitionEvent("start", () => {
    if (activeInstanceId === instanceId) {
      setIsListening(true);
      setError(null);
      setHasReceivedResult(false);
    }
  });
  
  useSpeechRecognitionEvent("end", () => {
    if (activeInstanceId === instanceId) {
      setIsListening(false);
      setHasReceivedResult((received) => {
        if (!received) {
          setError("No se detectó ninguna palabra. Por favor, intenta de nuevo.");
          setTranscription("");
        }
        return false; 
      });
      setActiveInstance(null);
    }
  });
  
  useSpeechRecognitionEvent("result", (event) => {
    if (activeInstanceId === instanceId) {
      const text = event.results[0]?.transcript;
      if (text) {
        setTranscription(text);
        setError(null);
        setHasReceivedResult(true);
      }
    }
  });
  
  useSpeechRecognitionEvent("error", (event) => {
    if (activeInstanceId === instanceId && event.error !== 'no-speech') {
      console.error("Speech recognition error:", event);
      setError(event.message || "Ocurrió un error en el reconocimiento de voz");
      setIsListening(false);
      setActiveInstance(null);
    }
  });

  const resetState = useCallback(() => {
    setTranscription("");
    setError(null);
    setIsListening(false);
    setHasReceivedResult(false);
  }, []);

  // Detectar cuando el contexto fuerza la detención
  useEffect(() => {
    if (isListening && activeInstanceId !== instanceId) {
      setIsListening(false);
      setActiveInstance(null);
      resetState();
      
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch (error) {
      }
    }
  }, [activeInstanceId, instanceId, isListening, resetState, setActiveInstance]);

  const startListening = useCallback(async () => {
    if (activeInstanceId && activeInstanceId !== instanceId) {
      return;
    }
    try {
      setActiveInstance(instanceId);
      setError(null);
      setTranscription("");
      setIsListening(false);
      setHasReceivedResult(false);

      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setError("Se requiere permiso para usar el micrófono");
        setActiveInstance(null);
        return;
      }

      try {
        await ExpoSpeechRecognitionModule.stop();
      } catch (e) {}

      await new Promise(resolve => setTimeout(resolve, 150));

      await ExpoSpeechRecognitionModule.start({
        lang: "es-ES",
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
      });
    } catch (err: any) {
      console.error("Error starting speech recognition:", err);
      setError("No se pudo iniciar el reconocimiento de voz");
      setIsListening(false);
      setActiveInstance(null);
    }
  }, [instanceId, activeInstanceId, setActiveInstance]);

  const stopListening = useCallback(async () => {
    if (activeInstanceId === instanceId) {
      try {
        await ExpoSpeechRecognitionModule.stop();
        setActiveInstance(null);
      } catch (err) {
        console.error("Error stopping speech recognition:", err);
      }
    }
  }, [instanceId, activeInstanceId, setActiveInstance]);

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

  // Deshabilitar si otra instancia está activa
  const isDisabled = activeInstanceId !== null && activeInstanceId !== instanceId;

  const handlePress = async () => {
    if (isDisabled) return;
    if (isListening) {
      await stopListening();
      if (transcription) {
        onTranscription(transcription);
      }
      resetState();
    } else {
      resetState();
      await startListening();
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      className={`w-8 h-8 rounded-full justify-center items-center ${className}`}
      style={[animatedStyle, isDisabled && { opacity: 0.4 }]}
      activeOpacity={0.7}
      disabled={isDisabled}
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