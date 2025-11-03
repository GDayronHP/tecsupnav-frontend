import { View, Text } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

interface FAQItemProps {
    question: string;
    answer: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function FAQItem({ question, answer, icon }: FAQItemProps) {
    return (
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-start mb-2">
                <Ionicons name={icon} size={20} color="#059669" className="mr-3 mt-0.5" />
                <Text className="text-base font-semibold text-neutral-900 flex-1">
                    {question}
                </Text>
            </View>
            <Text className="text-sm text-neutral-600 leading-5 ml-8">
                {answer}
            </Text>
        </View>
    )
}