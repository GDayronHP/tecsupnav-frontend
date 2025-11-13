import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import ChatbotMessagesElement from './ChatbotMessagesElement'
import { Message } from '@types/message';
import { Place } from '@types/place';
import { Option } from '@types/aiAssistant';

interface ChatbotMessagesContainerProps {
  messages: Message[];
  scrollViewRef: React.RefObject<ScrollView>;
  frequentQuestions: string[];
  handleFrequentQuestion: (question: string) => void;
  handlePlaceSelection: (place: Place) => void;
  handleOptionSelection: (option: Option, place?: Place) => void;
  formatTime: (date: Date) => string;
}

export default function ChatbotMessagesContainer({ messages, scrollViewRef, frequentQuestions, handleFrequentQuestion, handlePlaceSelection, handleOptionSelection, formatTime }: ChatbotMessagesContainerProps) {
  return (
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
        <ChatbotMessagesElement key={message.id} message={message} handlePlaceSelection={handlePlaceSelection} handleOptionSelection={handleOptionSelection} formatTime={formatTime} />
      ))}

      {/* Frequent Questions */}
      {messages.length <= 2 && (
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
  )
}