import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get("window");

const CHATBOT_HEIGHT = screenHeight * 0.7;
const TAB_BAR_HEIGHT = 50;

const ChatBot = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de navegación de CampusGo. Puedo ayudarte a encontrar aulas, laboratorios, pabellones y otros lugares",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const scrollViewRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const insets = useSafeAreaInsets();

  const frequentQuestions = [
    "¿Dónde está el Lab. de Electrónica?",
    "Llévame a la Biblioteca",
    "¿Cómo llego al Pabellón A?",
    "Buscar Aula A1",
    "Mostrar ruta a Cafetería",
  ];

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
      Animated.spring(slideAnim, {
        toValue: screenHeight - CHATBOT_HEIGHT,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible]);

  const sendMessage = (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simular respuesta del bot después de un delay
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      setMessages((prev) => [...prev, botResponse]);
      scrollToBottom();
    }, 1000);

    scrollToBottom();
  };

  // Data for generating bot responses
  const generateBotResponse = (userMessage) => {
    let response = "";
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("laboratorio") || lowerMessage.includes("lab")) {
      response =
        "Te ayudo a encontrar el laboratorio. ¿Podrías especificar cuál laboratorio necesitas? Por ejemplo: Lab. de Electrónica, Lab. de Cómputo, etc.";
    } else if (lowerMessage.includes("biblioteca")) {
      response =
        "La Biblioteca se encuentra en el Pabellón Principal, segundo piso. ¿Te gustaría que te muestre la ruta desde tu ubicación actual?";
    } else if (
      lowerMessage.includes("pabellón") ||
      lowerMessage.includes("pabellon")
    ) {
      response =
        "Hay varios pabellones en el campus. ¿Cuál pabellón específico estás buscando? A, B, C, Principal, etc.";
    } else if (lowerMessage.includes("aula")) {
      response =
        "Para ayudarte a encontrar el aula, necesito el código completo. Por ejemplo: A101, B205, C301, etc.";
    } else if (
      lowerMessage.includes("cafetería") ||
      lowerMessage.includes("cafeteria")
    ) {
      response =
        "La Cafetería está ubicada en el primer piso del Pabellón Principal. ¿Te muestro la ruta más rápida desde tu ubicación?";
    } else {
      response =
        "Entiendo tu consulta. Puedo ayudarte a encontrar aulas, laboratorios, pabellones y otros lugares del campus. ¿Podrías ser más específico sobre qué lugar estás buscando?";
    }

    return {
      id: Date.now() + 1,
      text: response,
      isBot: true,
      timestamp: new Date(),
    };
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleFrequentQuestion = (question) => {
    sendMessage(question);
  };

  // <----------------- VOICE RECOGNITION ------------------->

  // Implement voice recognition
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  // <------------------------------------------------------->

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Animated.View
      className="absolute left-0 right-0 bg-white z-60"
      style={{
        top: slideAnim,
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
      }}
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
          onPress={() => {
            setIsListening(false);
            Keyboard.dismiss();
            onClose();
          }}
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
                className={`flex-row ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot && (
                  <View className="w-8 h-8 bg-tecsup-cyan rounded-full justify-center items-center mr-2 mt-1">
                    <Ionicons name="chatbubble" size={16} color="white" />
                  </View>
                )}

                <View
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    message.isBot
                      ? "bg-neutral-100 rounded-bl-sm"
                      : "bg-tecsup-cyan rounded-br-sm"
                  }`}
                >
                  <Text
                    className={`text-base leading-5 ${
                      message.isBot ? "text-neutral-800" : "text-white"
                    }`}
                  >
                    {message.text}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      message.isBot ? "text-neutral-500" : "text-white/70"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
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
            <TouchableOpacity className="mr-3" onPress={toggleVoiceInput}>
              <Ionicons
                name={isListening ? "stop" : "mic"}
                size={20}
                color={isListening ? "#ef4444" : "#6b7280"}
              />
            </TouchableOpacity>

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

            <TouchableOpacity
              onPress={() => {
                sendMessage();
                Keyboard.dismiss();
              }}
              disabled={!inputText.trim()}
              className={`w-8 h-8 rounded-full justify-center items-center ml-3 ${
                inputText.trim() ? "bg-tecsup-cyan" : "bg-neutral-300"
              }`}
            >
              <Ionicons name="send" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-neutral-500 text-center mt-2">
            Presiona el micrófono para hablar o escribe tu pregunta
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default ChatBot;