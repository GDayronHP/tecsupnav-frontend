import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

// Hooks & Services
import { usePerformantAnimation } from "@hooks/usePerformantAnimation";
import { useLocation } from "@hooks/useLocation";
import { useAiAssistantService } from "../services/aiAssistantService";
import { useChatbotStore, usePlacesStore } from "@/stores";
import { useVoiceRecognition } from "@context/VoiceRecognitionContext";

import { useAnimatedStyle } from "react-native-reanimated";
import { AiAssistantServiceResponseV1 } from "@types/response/aiAssistant_response_v1";
import { Alert, Keyboard, Platform } from "react-native";
import { Place } from "@types/place";
import { Option } from "@types/aiAssistant";
import { Message } from "@types/message";
import usePlaceNavigation from "./usePlaceNavigation";

const { height: screenHeight } = Dimensions.get("window");

const CHATBOT_HEIGHT = screenHeight * 0.8;
const TAB_BAR_HEIGHT = 50;

interface ChatbotParams {
  isVisible: boolean;
  onClose: () => void;
  onNavigate?: () => void;
  initialQuery?: string;
}

export default function useChatbot({
  isVisible,
  initialQuery,
  onNavigate,
  onClose,
}: ChatbotParams) {
  // Zustand store subscriptions
  const pendingChatResponse = useChatbotStore(s => s.pendingChatResponse);
  const setPendingChatResponse = useChatbotStore(s => s.setPendingChatResponse);
  const setSelectedPlace = usePlacesStore(s => s.setSelectedPlace);
  
  const { forceStopActiveInstance } = useVoiceRecognition();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de navegación de CampusGo. Puedo ayudarte a encontrar aulas, laboratorios, pabellones y otros lugares",
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "💡 Consejo: Para mejores resultados, inicia tus consultas con palabras como:\n\n**Buscar** - laboratorio de química\n**Encontrar** - aula A1\n**Ir a** - biblioteca\n**Mostrar ruta** - cafetería\n**Dónde está** - el baño más cercano\n\nTambién puedes usar las preguntas frecuentes de abajo",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const { startNavigationMode } = usePlaceNavigation();
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Hooks de animación que respetan el modo de rendimiento
  const { animatedValue: slideAnim, animateWithTiming: animateSlide } =
    usePerformantAnimation(CHATBOT_HEIGHT);
  const { animateWithTiming: animateOverlayOpacity } =
    usePerformantAnimation(0);

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const frequentQuestions = [
    "¿Dónde está el Lab. de Electrónica?",
    "Buscar biblioteca",
    "Buscar servicios higiénicos",
    "Buscar Aula A1",
    "Mostrar ruta a Cafetería",
  ];

  // Integrar aiAssistantService
  const aiAssistantService = useAiAssistantService();
  const location = useLocation();

  const process = async ({
    text,
  }: {
    text: string;
  }): Promise<AiAssistantServiceResponseV1> => {
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
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
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
      requestAnimationFrame(() => {
        animateOverlayOpacity(1, { duration: 300 });
        animateSlide(screenHeight - CHATBOT_HEIGHT, { duration: 300 });
      });
    } else {
      animateOverlayOpacity(0, { duration: 300 });
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
        id: "view",
        label: "Ver información",
        description: `Ver detalles de ${place.nombre}`,
      },
      {
        id: "navigate",
        label: "Ir a este lugar",
        description: "Iniciar navegación en tiempo real",
      },
    ];

    const botResponse = {
      id: Date.now(),
      text: "¿Qué deseas hacer con este lugar?",
      isBot: true,
      timestamp: new Date(),
      options,
      selectedPlace: place,
    };

    setMessages((prev) => [...prev, botResponse]);
    scrollToBottom();
  };

  const handleOptionSelection = async (option: Option, place: Place) => {
    if (!place) return;

    if (option.id === "view") {
      const placeInfo = {
        id: Date.now(),
        text: `📍 ${place.nombre}\n\n${place.descripcion}\n\nUbicación: ${place.edificio}, Piso ${place.piso}`,
        isBot: true,
        timestamp: new Date(),
        selectedPlace: place,
      };
      setMessages((prev) => [...prev, placeInfo]);
      scrollToBottom();
    } else if (option.id === "navigate") {
      Alert.alert(
        "Iniciar Navegación",
        `¿Estás seguro que deseas iniciar la navegación hacia ${place.nombre}?\n\nEsto cerrará el chat y comenzará la navegación en tiempo real.`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Sí, iniciar",
            style: "default",
            onPress: () => {
              if (onNavigate) {
                setSelectedPlace(place);
                startNavigationMode();
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

    // Detener cualquier reconocimiento de voz activo antes de enviar el mensaje
    forceStopActiveInstance();

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
      let response;
      
      // Si hay una respuesta pre-computada para esta query, usarla
      if (pendingChatResponse && messageText === initialQuery) {
        console.log("🚀 Usando respuesta pre-computada, evitando petición duplicada");
        response = pendingChatResponse;
        setPendingChatResponse(null);
      } else {
        response = await process({ text: messageText });
      }

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

      setMessages((prev) => [...prev, botResponse]);
      scrollToBottom();
    } catch (error) {
      console.error("Error processing message:", error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Lo siento, ha ocurrido un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
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

  return {
    shouldRender,
    slideAnimatedStyle,
    insets,
    messages,
    scrollViewRef,
    frequentQuestions,
    inputText,
    isKeyboardVisible,
    handleClose,
    handleVoiceTranscription,
    handleFrequentQuestion,
    handlePlaceSelection,
    handleOptionSelection,
    sendMessage,
    formatTime,
    keyboardHeight,
    setInputText,
    CHATBOT_HEIGHT,
    TAB_BAR_HEIGHT,
  };
}
