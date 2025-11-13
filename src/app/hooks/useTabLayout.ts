import { useCallback, useState, useRef } from "react";
import { router } from "expo-router";

import { useSpeechToText } from "@features/home/hooks/useSpeechToText";

// Hooks & Services
import { useAiAssistantService } from "@features/home/services/aiAssistantService";
import { usePlaces } from "@context/PlacesContext";
import { useLocation } from "@hooks/useLocation";
import usePlaceNavigation from "@features/home/hooks/usePlaceNavigation";

import { useChatbot } from "@context/ChatbotContext";
import { Alert } from "react-native";

export default function useTabLayout() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // Estado para mostrar el chatbot y consulta pendiente
  const {
    showChatBot,
    setShowChatBot,
    openChatBot,
    closeChatBot,
    pendingChatQuery,
    setPendingChatQuery,
    pendingChatResponse,
    setPendingChatResponse,
  } = useChatbot();

  // Voice recognition hooks
  const { location } = useLocation();
  const { setSelectedPlace, setShowPlaceInfo, setShowRoute } = usePlaces();
  const { isListening, transcription, error, startListening, resetState } =
    useSpeechToText();

  const { startNavigationMode } = usePlaceNavigation();

  // Refs for tab positions
  const [tabWidth, setTabWidth] = useState(0);
  const mainTabsRef = useRef(null);

  const handleVoiceConfirm = useCallback(
    (place) => {
      if (place) {
        setSelectedPlace(place);
        startNavigationMode();
      }
      setAiResponse(null);
      resetState();
      setShowVoiceModal(false);
    },
    [resetState, setSelectedPlace, setShowPlaceInfo, setShowRoute]
  );

  const handleVoiceCancel = useCallback(() => {
    setAiResponse(null);
    resetState();
    setShowVoiceModal(false);
  }, [resetState]);

  const handleVoiceRetry = useCallback(async () => {
    resetState();
    await startListening();
  }, [resetState, startListening]);

  const handleVoiceAiResponse = useCallback(
    async (text) => {
      try {
        const result = await useAiAssistantService().process({
          query: text,
          currentLat: location?.coords?.latitude || 0,
          currentLng: location?.coords?.longitude || 0,
        });

        console.log("🧠 AI Assistant Response:", result);

        if (result.message) throw new Error(result.message);

        setAiResponse(result);

        let hasPlaces = result.data.data?.places && (result.data.data.places.length > 0);

        if (!hasPlaces && result.data.action === "navigate") {
          Alert.alert(
            "Error de navegación",
            "No se encontraron lugares para navegar según tu solicitud."
          );
          setAiResponse(null);
          resetState();
          setShowVoiceModal(false);
          return;
        }

        // Si no hay lugares y no es navegación, enviar al chatbot con respuesta pre-computada
        if (!hasPlaces && result.data.action !== "navigate") {
          console.log(
            "📝 No hay lugares y no es navegación, enviando al chatbot con respuesta pre-computada"
          );
          setAiResponse(null);
          resetState();
          setShowVoiceModal(false);
          setPendingChatQuery(text);
          setPendingChatResponse(result);
          setShowChatBot(true);
          return;
        }

        // Si hay un solo lugar y es navegación, auto-navegar
        if (
          hasPlaces &&
          result.data.data.places.length === 1 &&
          result.data.action === "navigate"
        ) {
          console.log("🚀 Auto-navegando a lugar único");
          const place = result.data.data.places[0];
          setSelectedPlace(place);
          setShowPlaceInfo(false);
          setShowRoute(true);
          setAiResponse(null);
          resetState();
          setShowVoiceModal(false);
          setTimeout(() => {
            router.push("/navigation");
          }, 100);
          return;
        }

        // Si hay múltiples lugares, mostrar opciones en el modal
        if (hasPlaces && result.data.data.places.length > 1) {
          console.log("📋 Mostrando múltiples opciones en modal");
          // El aiResponse ya está seteado, el modal mostrará las opciones
          return;
        }

        // Para cualquier otro caso no manejado, mostrar en el modal
        console.log("⚠️ Caso no manejado, mostrando en modal por defecto");
      } catch (error) {
        Alert.alert(
          "Error",
          "Ocurrió un error al procesar tu solicitud de voz. Por favor, intenta nuevamente."
        );
        console.error("Error en handleVoiceAiResponse:", error);
        setAiResponse(null);
        resetState();
        setShowVoiceModal(false);
      }
    },
    [location?.coords?.latitude, location?.coords?.longitude]
  );

  const handleGoToChatBot = useCallback(
    (query: string, response?: any) => {
      console.log("💬 Redirigiendo al chatbot con query:", query);
      setAiResponse(null);
      resetState();
      setShowVoiceModal(false);
      setPendingChatQuery(query);
      if (response) {
        setPendingChatResponse(response);
      }
      setShowChatBot(true);
    },
    [resetState, setPendingChatQuery, setPendingChatResponse, setShowChatBot]
  );

  const navigate = useCallback(() => {
    setShowChatBot(false);
    setPendingChatQuery("");
    setPendingChatResponse(null);
  }, [setPendingChatQuery, setPendingChatResponse]);

  return {
    mainTabsRef,
    tabWidth,
    setTabWidth,
    showSettingsModal,
    setShowSettingsModal,
    showVoiceModal,
    setShowVoiceModal,
    aiResponse,
    isListening,
    transcription,
    error,
    startListening,
    resetState,
    showChatBot,
    setShowChatBot,
    pendingChatQuery,
    setPendingChatQuery,
    handleVoiceRetry,
    handleVoiceCancel,
    handleVoiceConfirm,
    handleVoiceAiResponse,
    handleGoToChatBot,
    openChatBot,
    closeChatBot,
    navigate,
  };
}
