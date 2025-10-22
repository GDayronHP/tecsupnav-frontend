import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Option } from '../../../types/aiAssistant';
import { Place } from '../../../types/place';
import { AiAssistantServiceResponseV1 } from '../../../types/response/aiAssistant_response_v1';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import Backdrop from '@components/Backdrop';

interface VoiceConfirmationModalProps {
  visible: boolean;
  transcription: string;
  isListening: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: (place: Place) => void;
  onAiResponse: (transcription: string) => void;
  startListening?: () => Promise<void>;
  aiResponse?: AiAssistantServiceResponseV1;
}

const VoiceConfirmationModal: React.FC<VoiceConfirmationModalProps> = ({
  visible,
  transcription,
  isListening,
  error,
  onCancel = () => { },
  onConfirm = () => { },
  startListening = async () => { },
  aiResponse,
  onAiResponse = () => { },
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (visible && isListening) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1);
      opacity.value = withTiming(0.3);
    }
  }, [visible, isListening]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center p-4">
        {/* Overlay opaco */}
        <Backdrop />

        {/* Fase de escucha o sin transcripción */}
        {(isListening || !transcription) && (
          <View className="items-center">
            {/* Círculo de pulso animado */}
            <View className="relative items-center justify-center">
              <Animated.View
                style={[pulseAnimatedStyle]}
                className="absolute w-32 h-32 rounded-full bg-primary-500"
              />

              {/* Círculo principal del micrófono */}
              <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center shadow-2xl z-10">
                <Ionicons name="mic" size={48} color="white" />
              </View>
            </View>

            <Text className="text-white text-lg font-medium mt-8 text-center px-6">
              {error ? "No te escuché. Toca para intentar de nuevo" : "Di el lugar a donde quieres ir"}
            </Text>

            {error ? (
              <TouchableOpacity
                onPress={async () => {
                  await startListening();
                }}
                className="bg-primary-100/20 px-6 py-3 rounded-full mt-4"
                activeOpacity={0.7}
              >
                <Text className="text-white text-base text-center">
                  Intentar de nuevo
                </Text>
              </TouchableOpacity>
            ) : transcription ? (
              <Text className="text-primary-100 text-base mt-4 text-center px-6 italic">
                "{transcription}"
              </Text>
            ) : null}
          </View>
        )}

        {/* Fase de confirmación de transcripción */}
        {!isListening && transcription && !aiResponse && (
          <View className="bg-white rounded-card shadow-card-hover w-full max-w-md p-6">
            <View className="items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center">
                <Ionicons name="mic-outline" size={32} color="#008c9c" />
              </View>
            </View>

            <Text className="text-title text-tecsup-text-primary text-center mb-3">
              ¿Es esto correcto?
            </Text>

            <Text className="text-body text-tecsup-text-secondary text-center mb-4">
              Entendí que dijiste:
            </Text>

            <View className="bg-neutral-50 rounded-input p-4 mb-6">
              <Text className="text-body text-tecsup-text-primary text-center font-medium">
                "{transcription}"
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 flex-row items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-neutral-200 rounded-button shadow-button"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#1e293b" />
                <Text className="text-label text-tecsup-text-primary">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onAiResponse(transcription)}
                className="flex-1 flex-row items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-button shadow-button"
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark" size={20} color="#ffffff" />
                <Text className="text-label text-white">Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Fase de mostrar resultados de IA */}
        {!isListening && aiResponse && (
          <View className="bg-white rounded-card shadow-card-hover w-full max-w-md p-6">
            {/* Mostrar opciones si existen */}
            {Array.isArray(aiResponse.data.options) && aiResponse.data.options.length > 0 ? (
              <>
                <Text className="text-title text-tecsup-text-primary text-center mb-4">
                  Opciones encontradas
                </Text>
                <ScrollView className="max-h-96">
                  {aiResponse.data.data.places.map((option) => {
                    return (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => onConfirm(option)}
                        className="flex-row items-center bg-neutral-50 rounded-xl p-4 mb-3"
                        activeOpacity={0.7}
                      >
                        <View className="w-16 h-16 rounded-xl bg-primary-100 mr-3 items-center justify-center">
                          <Ionicons name="location" size={32} color="#008c9c" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-subtitle text-tecsup-text-primary font-medium">
                            {option.nombre}
                          </Text>
                          {option.descripcion && (
                            <Text className="text-caption text-tecsup-text-secondary mt-1">
                              {option.descripcion}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <TouchableOpacity
                  onPress={onCancel}
                  className="mt-4 px-6 py-3 bg-white border-2 border-neutral-200 rounded-button shadow-button"
                  activeOpacity={0.7}
                >
                  <Text className="text-label text-tecsup-text-primary text-center">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {/* Si no hay opciones, mostrar solo el resultado principal si existe y la acción es 'navigate' */}
            {!aiResponse.data.options || aiResponse.data.options.length === 0 ? (
              aiResponse.data.action === "navigate" && aiResponse.data.data?.places?.length > 0 ? (
                <>
                  <View className="items-center mb-6">
                    <Image
                      source={
                        aiResponse.data.data?.places?.[0]?.imagen
                          ? { uri: aiResponse.data.data.places[0].imagen }
                          : require('@assets/images/placeholder-image.webp')
                      }
                      contentFit='cover'
                      className="w-32 h-32 rounded-2xl"
                    />
                  </View>
                  <Text className="text-title text-tecsup-text-primary text-center mb-3">
                    {aiResponse.data.data?.places?.[0]?.nombre}
                  </Text>
                  <Text className="text-body text-tecsup-text-secondary text-center mb-6">
                    {aiResponse.data.data?.places?.[0]?.descripcion}
                  </Text>
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={onCancel}
                      className="flex-1 flex-row items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-neutral-200 rounded-button shadow-button"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={20} color="#1e293b" />
                      <Text className="text-label text-tecsup-text-primary">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onConfirm(aiResponse.data.data?.places?.[0])}
                      className="flex-1 flex-row items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-button shadow-button"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="navigate" size={20} color="#ffffff" />
                      <Text className="text-label text-white">Ir ahí</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : null
            ) : null}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default VoiceConfirmationModal;