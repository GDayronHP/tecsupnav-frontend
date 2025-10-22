import { useCallback, useState, useRef } from 'react'
import { router } from 'expo-router';

import { useSpeechToText } from '@features/home/hooks/useSpeechToText';

// Hooks & Services
import { useAiAssistantService } from '@features/home/services/aiAssistantService';
import { usePlaces } from '@context/PlacesContext';
import { useLocation } from '@hooks/useLocation';
import usePlaceNavigation from '@features/home/hooks/usePlaceNavigation';

export default function useTabLayout() {
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);

    // Estado para mostrar el chatbot y consulta pendiente
    const [showChatBot, setShowChatBot] = useState(false);
    const [pendingChatQuery, setPendingChatQuery] = useState("");

    // Voice recognition hooks
    const { location } = useLocation();
    const { setSelectedPlace, setShowPlaceInfo, setShowRoute } = usePlaces();
    const {
        isListening,
        transcription,
        error,
        startListening,
        resetState
    } = useSpeechToText();

    const { startNavigationMode } = usePlaceNavigation();

    // Refs for tab positions
    const [tabWidth, setTabWidth] = useState(0);
    const mainTabsRef = useRef(null);

    const handleVoiceConfirm = useCallback((place) => {
        if (place) {
            setSelectedPlace(place);
            startNavigationMode();
        }
        setAiResponse(null);
        resetState();
        setShowVoiceModal(false);
    }, [resetState, setSelectedPlace, setShowPlaceInfo, setShowRoute]);

    const handleVoiceCancel = useCallback(() => {
        setAiResponse(null);
        resetState();
        setShowVoiceModal(false);
    }, [resetState]);

    const handleVoiceRetry = useCallback(async () => {
        resetState();
        await startListening();
    }, [resetState, startListening]);

    const handleVoiceAiResponse = useCallback(async (text) => {
        try {
            const result = await useAiAssistantService().process({
                query: text,
                currentLat: location?.coords?.latitude || 0,
                currentLng: location?.coords?.longitude || 0
            });

            setAiResponse(result);

            // If no options and single place for navigation, auto-navigate
            if (!result.data.options || result.data.options.length === 0) {
                if (result.data.action === "navigate" && result.data.data?.places?.length === 1) {
                    const place = result.data.data.places[0];
                    setSelectedPlace(place);
                    setShowPlaceInfo(false);
                    setShowRoute(true);
                    setAiResponse(null);
                    resetState();
                    setShowVoiceModal(false);
                    setTimeout(() => {
                        router.push('/navigation');
                    }, 100);
                    return;
                } else if (result.data.action !== "navigate") {
                    setAiResponse(null);
                    resetState();
                    setShowVoiceModal(false);
                    setPendingChatQuery(text);
                    setShowChatBot(true);
                    return;
                }
            }

            // If single option and single place, auto-navigate
            if (result.data.options && result.data.options.length === 1 && result.data.data?.places?.length === 1) {
                const place = result.data.data.places[0];
                setSelectedPlace(place);
                setShowPlaceInfo(false);
                setShowRoute(true);
                setAiResponse(null);
                resetState();
                setShowVoiceModal(false);
                setTimeout(() => {
                    router.push('/navigation');
                }, 100);
                return;
            }

        } catch (error) {
            console.error("Error processing AI response:", error);
        }
    }, [location?.coords?.latitude, location?.coords?.longitude]);

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
    }
}