import { View, Text } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import AnimatedButton from '@components/AnimatedButton'
interface ContactOptionProps {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export default function ContactOption({ title, subtitle, icon, onPress }: ContactOptionProps) {
    return (
        <AnimatedButton
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
            onPress={onPress}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className="bg-primary-50 rounded-full p-2 mr-3">
                        <Ionicons name={icon} size={20} color="#059669" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-neutral-900">
                            {title}
                        </Text>
                        <Text className="text-sm text-neutral-600">
                            {subtitle}
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
        </AnimatedButton>
    )
}