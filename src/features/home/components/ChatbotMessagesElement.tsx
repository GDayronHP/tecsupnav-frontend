import { View, Text } from 'react-native'

import { ChatBotOptions } from './ChatBotOptions';
import { Ionicons } from '@expo/vector-icons';

import { Message } from '@types/message';
import { Place } from '@types/place';
import { Option } from '@types/aiAssistant';

interface ChatbotMessagesElementProps {
    message: Message;
    handlePlaceSelection: (place: Place) => void;
    handleOptionSelection: (option: Option, place?: Place) => void;
    formatTime: (date: Date) => string;
}

export default function ChatbotMessagesElement({ message, handlePlaceSelection, handleOptionSelection, formatTime }: ChatbotMessagesElementProps) {
    return (
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
                            {message.places?.length > 0 || message.options?.length > 0 ? (
                                <>
                                    {'Estas son las opciones disponibles:'}
                                </>
                            ) : message.text}
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
                        <Text
                            className={`text-xs mt-1 ${message.isBot ? "text-neutral-500" : "text-white/70"
                                }`}
                        >
                            {formatTime(message.timestamp)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}