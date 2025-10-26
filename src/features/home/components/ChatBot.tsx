import {
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated from 'react-native-reanimated';

import ChatbotMessagesContainer from "./ChatbotMessagesContainer";
import Backdrop from "@components/Backdrop";
import ChatbotHeader from "./ChatbotHeader";

import useChatbot from "../hooks/useChatbot";
import ChatbotInput from "./ChatbotInput";

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

  const { shouldRender, slideAnimatedStyle, insets, messages, scrollViewRef, frequentQuestions, inputText, isKeyboardVisible, handleClose, handleVoiceTranscription, handleFrequentQuestion, handlePlaceSelection, handleOptionSelection, sendMessage, formatTime, keyboardHeight, setInputText, CHATBOT_HEIGHT, TAB_BAR_HEIGHT } = useChatbot({ isVisible, initialQuery, onNavigate, onClose });

  if (!shouldRender) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-60">

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
        {/* Header */}
        <ChatbotHeader handleClose={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
          className="flex-1"
        >
          {/* Messages Container */}
          <ChatbotMessagesContainer
            messages={messages}
            scrollViewRef={scrollViewRef}
            frequentQuestions={frequentQuestions}
            handleFrequentQuestion={handleFrequentQuestion}
            handlePlaceSelection={handlePlaceSelection}
            handleOptionSelection={handleOptionSelection}
            formatTime={formatTime}
          />

          {/* Input Container */}
          <ChatbotInput
            inputText={inputText}
            setInputText={setInputText}
            sendMessage={sendMessage}
            handleVoiceTranscription={handleVoiceTranscription}
            isKeyboardVisible={isKeyboardVisible}
            insets={insets}
            keyboardHeight={keyboardHeight}
            TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default ChatBot;