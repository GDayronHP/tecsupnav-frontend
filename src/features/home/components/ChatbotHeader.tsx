import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

interface ChatbotHeaderProps {
    handleClose: () => void;
}

export default function ChatbotHeader({ handleClose }: ChatbotHeaderProps) {
    return (
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
                onPress={handleClose}
                className="w-8 h-8 bg-white/20 rounded-full justify-center items-center"
            >
                <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
        </View>
    )
}