import { View, Text } from 'react-native'
import React from 'react'

export default function BulletPoint({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row mb-2">
      <Text className="text-primary-600 mr-2">•</Text>
      <Text className="text-sm text-neutral-700 leading-5 flex-1">
        {children}
      </Text>
    </View>
  )
}