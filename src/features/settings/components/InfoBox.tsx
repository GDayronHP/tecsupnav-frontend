import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
}

export default function InfoBox({ title, children }: InfoBoxProps) {
  return (
    <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
      <View className="flex-row items-center mb-2">
        <Ionicons name="information-circle" size={16} color="#2563eb" />
        <Text className="text-sm font-semibold text-blue-800 ml-2">
          {title}
        </Text>
      </View>
      <Text className="text-sm text-blue-700">
        {children}
      </Text>
    </View>
  )
}