import { View, Text } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons';

export default function Achievements() {
    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
                <Ionicons name="trophy-outline" size={20} color="#6B7280" />
                <Text className="text-lg font-semibold text-neutral-900 ml-2">
                    Logros Recientes
                </Text>
            </View>

            <View className="flex-row justify-between">
                <View className="items-center flex-1">
                    <View className="w-12 h-12 bg-yellow-100 rounded-full justify-center items-center mb-2">
                        <Ionicons name="trophy" size={24} color="#F59E0B" />
                    </View>
                    <Text className="text-xs text-neutral-600 text-center">
                        Primer{'\n'}Navegador
                    </Text>
                </View>

                <View className="items-center flex-1">
                    <View className="w-12 h-12 bg-blue-100 rounded-full justify-center items-center mb-2">
                        <Ionicons name="map" size={24} color="#3B82F6" />
                    </View>
                    <Text className="text-xs text-neutral-600 text-center">
                        Explorador{'\n'}Activo
                    </Text>
                </View>

                <View className="items-center flex-1">
                    <View className="w-12 h-12 bg-green-100 rounded-full justify-center items-center mb-2">
                        <Ionicons name="location" size={24} color="#10B981" />
                    </View>
                    <Text className="text-xs text-neutral-600 text-center">
                        20 Lugares{'\n'}Visitados
                    </Text>
                </View>

                <View className="items-center flex-1">
                    <View className="w-12 h-12 bg-purple-100 rounded-full justify-center items-center mb-2">
                        <Ionicons name="time" size={24} color="#8B5CF6" />
                    </View>
                    <Text className="text-xs text-neutral-600 text-center">
                        Usuario{'\n'}Constante
                    </Text>
                </View>
            </View>
        </View>
    )
}