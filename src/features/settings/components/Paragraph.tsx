import { View, Text } from 'react-native'
import React from 'react'

export default function Paragraph({ children }: { children: React.ReactNode }) {
  return (
     <Text className="text-sm text-neutral-700 leading-6 mb-3">
      {children}
    </Text>
  )
}