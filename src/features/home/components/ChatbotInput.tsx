import { View, Text } from 'react-native'
import React from 'react'

import { TextInput, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceChatButton from './VoiceChatButton';
import { AnimatedChatButton } from './AnimatedButtons';

interface ChatbotInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    sendMessage: () => void;
    handleVoiceTranscription: (transcription: string) => void;
    isKeyboardVisible: boolean;
    insets: { bottom: number };
    keyboardHeight: number;
    TAB_BAR_HEIGHT: number;
}

export default function ChatbotInput({
    inputText,
    setInputText,
    sendMessage,
    handleVoiceTranscription,
    isKeyboardVisible,
    insets,
    keyboardHeight,
    TAB_BAR_HEIGHT
}: ChatbotInputProps) {
    return (
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
    )
}