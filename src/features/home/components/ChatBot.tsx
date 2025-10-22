import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

// Hooks & Services
import { usePerformantAnimation } from '@hooks/usePerformantAnimation';
import { useLocation } from '@hooks/useLocation';
import { useAiAssistantService } from "../services/aiAssistantService";

// Components
import VoiceChatButton from "./VoiceChatButton";
import { AnimatedChatButton } from "./AnimatedButtons";

import type { Place } from '@types/place';
import type { Option } from '@types/aiAssistant';
import type { AiAssistantServiceResponseV1 } from '@types/response/aiAssistant_response_v1';
import type { Message } from '@types/message';

import { ChatBotOptions } from './ChatBotOptions';
import { usePlaces } from "@context/PlacesContext";
import Backdrop from "@components/Backdrop";

const { height: screenHeight } = Dimensions.get("window");

const CHATBOT_HEIGHT = screenHeight * 0.8;
const TAB_BAR_HEIGHT = 50;

interface ChatBotProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate?: () => void;
  initialQuery?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({
  isVisible,
  onClose,
  onNavigate,
  initialQuery
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de navegación de CampusGo. Puedo ayudarte a encontrar aulas, laboratorios, pabellones y otros lugares",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Hooks de animación que respetan el modo de rendimiento
  const { animatedValue: slideAnim, animateWithTiming: animateSlide } = usePerformantAnimation(CHATBOT_HEIGHT);
  const { animateWithTiming: animateOverlayOpacity } = usePerformantAnimation(0);
  const { setSelectedPlace } = usePlaces();

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const frequentQuestions = [
    "¿Dónde está el Lab. de Electrónica?",
    "Llévame a la Biblioteca",
    "Buscar servicios higiénicos",
    "Buscar Aula A1",
    "Mostrar ruta a Cafetería",
  ];

  // Integrar aiAssistantService
  const aiAssistantService = useAiAssistantService();
  const location = useLocation();

  const process = async ({ text }: { text: string }): Promise<AiAssistantServiceResponseV1> => {
    if (location.loading) {
      throw new Error("Obteniendo ubicación...");
    }

    if (location.errorMsg) {
      throw new Error(`Error al obtener ubicación: ${location.errorMsg}`);
    }

    if (!location.location) {
      throw new Error("Ubicación no disponible");
    }

    const response = await aiAssistantService.process({
      query: text,
      currentLat: location.location.coords.latitude,
      currentLng: location.location.coords.longitude,
    });

    return response;
  };

  useEffect(() => {
    const keyboardWillShow = (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setIsKeyboardVisible(true);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      animateOverlayOpacity(1, { duration: 300 });
      animateSlide(screenHeight - CHATBOT_HEIGHT, { duration: 300 });
    } else {
      animateOverlayOpacity(0, { duration: 250 });
      animateSlide(screenHeight, { duration: 300 });
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animateOverlayOpacity, animateSlide]);

  useEffect(() => {
    if (initialQuery && isVisible) {
      const timer = setTimeout(() => {
        sendMessage(initialQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, isVisible]);

  const handlePlaceSelection = (place: Place) => {
    const options = [
      {
        id: 'view',
        label: 'Ver información',
        description: `Ver detalles de ${place.nombre}`
      },
      {
        id: 'navigate',
        label: 'Ir a este lugar',
        description: 'Iniciar navegación en tiempo real',
      }
    ];

    const botResponse = {
      id: Date.now(),
      text: '¿Qué deseas hacer con este lugar?',
      isBot: true,
      timestamp: new Date(),
      options,
      selectedPlace: place
    };

    setMessages(prev => [...prev, botResponse]);
    scrollToBottom();
  };

  const handleOptionSelection = async (option: Option, place: Place) => {
    if (!place) return;

    if (option.id === 'view') {

      const placeInfo = {
        id: Date.now(),
        text: `📍 ${place.nombre}\n\n${place.descripcion}\n\nUbicación: ${place.edificio}, Piso ${place.piso}`,
        isBot: true,
        timestamp: new Date(),
        selectedPlace: place,
      };
      setMessages(prev => [...prev, placeInfo]);
      scrollToBottom();

    } else if (option.id === 'navigate') {
      Alert.alert(
        'Iniciar Navegación',
        `¿Estás seguro que deseas iniciar la navegación hacia ${place.nombre}?\n\nEsto cerrará el chat y comenzará la navegación en tiempo real.`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sí, iniciar',
            style: 'default',
            onPress: () => {
              if (onNavigate) {
                setSelectedPlace(place);
                onNavigate();
                handleClose();
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const sendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    scrollToBottom();

    try {
      const response = await process({ text: messageText });

      const botResponse: any = {
        id: Date.now() + 1,
        text: response.data.message,
        isBot: true,
        timestamp: new Date(),
      };

      if (response.data.data?.places?.length > 0) {
        botResponse.places = response.data.data.places;
      }

      if (response.data.options?.length > 0) {
        botResponse.options = response.data.options;
      }

      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Lo siento, ha ocurrido un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleFrequentQuestion = (question) => {
    sendMessage(question);
  };

  const handleVoiceTranscription = (transcription: string) => {
    setInputText(transcription);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!shouldRender) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-60">
      {/* Overlay que bloquea interacciones pero permite input y cierre */}
      <Backdrop onClose={handleClose} />

      {/* ChatBot Modal */}
      <Animated.View
        className="absolute left-0 right-0 bg-white"
        style={[
          {
            height: CHATBOT_HEIGHT,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
            paddingBottom: insets.bottom,
          },
          slideAnimatedStyle,
        ]}
      >
        {/* Header fijo */}
        <View className="bg-tecsup-cyan px-4 py-3 flex-row items-center justify-between rounded-t-[20px]">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-white/20 rounded-full justify-center items-center mr-3">
              <Ionicons name="chatbubble" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">
                Asistente CampusGo
              </Text>
              <Text className="text-white/80 text-sm">
                Navegación inteligente Tecsup
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="w-8 h-8 bg-white/20 rounded-full justify-center items-center"
          >
            <Ionicons name="close" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
          className="flex-1"
        >
          {/* Messages Container */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              flexGrow: 1
            }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message) => (
              <View key={message.id} className="mb-4">
                <View
                  className={`flex-row ${message.isBot ? "justify-start" : "justify-end"
                    }`}
                >
                  {message.isBot && (
                    <View className="w-8 h-8 bg-tecsup-cyan rounded-full justify-center items-center mr-2 mt-1">
                      <Ionicons name="chatbubble" size={16} color="white" />
                    </View>
                  )}

                  <View
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.isBot
                      ? "bg-neutral-100 rounded-bl-sm"
                      : "bg-tecsup-cyan rounded-br-sm"
                      }`}
                  >
                    <View>
                      <Text
                        className={`text-base leading-5 ${message.isBot ? "text-neutral-800" : "text-white"
                          }`}
                      >
                        {message.text}
                      </Text>
                      <Text
                        className={`text-xs mt-1 ${message.isBot ? "text-neutral-500" : "text-white/70"
                          }`}
                      >
                        {formatTime(message.timestamp)}
                      </Text>
                      {message.isBot && (message.places || message.options) && (
                        <View className="mt-3">
                          <ChatBotOptions
                            places={message.places}
                            options={message.options}
                            selectedPlace={message.selectedPlace}
                            onPlaceSelect={handlePlaceSelection}
                            onOptionSelect={(option) =>
                              handleOptionSelection(option, message.selectedPlace)
                            }
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Frequent Questions */}
            {messages.length <= 1 && (
              <View className="mt-4">
                <Text className="text-neutral-600 font-medium mb-3">
                  Preguntas frecuentes:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {frequentQuestions.map((question, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleFrequentQuestion(question)}
                      className="bg-tecsup-cyan/10 border border-tecsup-cyan/30 px-3 py-2 rounded-full"
                    >
                      <Text className="text-tecsup-cyan text-sm">
                        {question}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Container */}
          <View
            className="px-4 py-4 border-t border-neutral-200 bg-white"
            style={{
              paddingBottom: isKeyboardVisible ? insets.bottom : insets.bottom + TAB_BAR_HEIGHT,
              marginBottom: Platform.OS === 'android' ? keyboardHeight : 0
            }}
          >
            <View className="flex-row items-center bg-neutral-50 rounded-2xl px-4 py-2">
              <VoiceChatButton
                onTranscription={handleVoiceTranscription}
                className="mr-3"
              />

              <TextInput
                className="flex-1 text-base text-neutral-800 py-2"
                placeholder="Pregúntame sobre ubicaciones..."
                placeholderTextColor="#9ca3af"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                textAlignVertical="top"
                style={{
                  maxHeight: 80,
                  minHeight: 40
                }}
                onSubmitEditing={() => {
                  sendMessage();
                  Keyboard.dismiss();
                }}
                returnKeyType="send"
              />

              <AnimatedChatButton
                onPress={() => {
                  sendMessage();
                  Keyboard.dismiss();
                }}
                className={`w-8 h-8 rounded-full justify-center items-center ml-3 ${inputText.trim() ? "bg-tecsup-cyan" : "bg-neutral-300"
                  }`}
              >
                <Ionicons name="send" size={16} color="white" />
              </AnimatedChatButton>
            </View>

            <Text className="text-xs text-neutral-500 text-center mt-2 pb-4">
              Presiona el micrófono para hablar o escribe tu pregunta
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default ChatBot;