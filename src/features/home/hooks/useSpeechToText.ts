import { useState, useCallback } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface SpeechToTextHook {
  isListening: boolean;
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  transcription: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  resetState: () => void;
}

export function useSpeechToText(): SpeechToTextHook {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasReceivedResult, setHasReceivedResult] = useState(false);

  // Función para resetear todo el estado
  const resetState = useCallback(() => {
    setTranscription("");
    setError(null);
    setIsListening(false);
    setHasReceivedResult(false);
  }, []);

  // Eventos de reconocimiento
  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    setError(null);
    setHasReceivedResult(false); // Reset flag cuando inicia
  });
  
  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    // Verificar si se recibió algún resultado en esta sesión
    setHasReceivedResult((received) => {
      if (!received) {
        setError("No se detectó ninguna palabra. Por favor, intenta de nuevo.");
        setTranscription(""); // Limpiar transcripción vieja si no hubo resultado
      }
      return false; // Reset para la próxima sesión
    });
  });
  
  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript;
    if (text) {
      setTranscription(text);
      setError(null);
      setHasReceivedResult(true); // Marcar que se recibió resultado
    }
  });
  
  useSpeechRecognitionEvent("error", (event) => {
    // Solo manejar errores críticos, no la falta de detección
    if (event.error !== 'no-speech') {
      console.error("Speech recognition error:", event);
      setError(event.message || "Ocurrió un error en el reconocimiento de voz");
      setIsListening(false);
    }
  });

  // Iniciar reconocimiento
  const startListening = useCallback(async () => {
    try {
      // Limpiar estados anteriores INMEDIATAMENTE
      setError(null);
      setTranscription("");
      setIsListening(false);
      setHasReceivedResult(false);

      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setError("Se requiere permiso para usar el micrófono y reconocimiento de voz");
        return;
      }

      // Detener cualquier sesión activa antes de iniciar una nueva
      try {
        await ExpoSpeechRecognitionModule.stop();
      } catch (e) {
        // Ignorar errores al detener, puede que no haya sesión activa
      }

      // Esperar un momento para asegurar que todo se limpió
      await new Promise(resolve => setTimeout(resolve, 150));

      try {
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
      }
    } catch (err: any) {
      console.error("Error in speech recognition setup:", err);
      setError("No se pudo iniciar el reconocimiento de voz");
      setIsListening(false);
    }
  }, []);

  // Detener reconocimiento
  const stopListening = useCallback(async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (err: any) {
      console.error("Error stopping speech recognition:", err);
      setError("No se pudo detener el reconocimiento de voz");
    } finally {
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    setTranscription,
    transcription,
    error,
    startListening,
    stopListening,
    resetState,
  };
}