import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Navigation } from '@types/navigation';

interface NavigationCardProps {
    navigationData?: Navigation;
}

export default function NavigationCard({ navigationData }: NavigationCardProps) {
    return (
        <View className="absolute top-12 left-4 right-4 z-10">
            <View className="bg-white rounded-card p-4 shadow-card-hover border-l-4 border-primary-500">
                <View className="flex-row items-center mb-1">
                    <View className="w-6 h-6 bg-primary-500 rounded-full items-center justify-center mr-3">
                        <Ionicons name="navigate" size={14} color="white" />
                    </View>
                    <Text className="text-label text-neutral-900 font-semibold">
                        Próxima indicación
                    </Text>
                </View>
                <Text className="text-body text-neutral-700 ml-9">
                   {navigationData?.instructions[0] || 'Sin indicación'}
                </Text>
                <View className="flex-row items-center mt-2 ml-9">
                    <View className="bg-neutral-100 px-2 py-1 rounded-base mr-3">
                        <Text className="text-caption text-neutral-600 font-medium">En {navigationData?.route.distancia}m</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#00BCD4" />
                        <Text className="text-caption text-primary-500 font-medium ml-1">{navigationData?.direccion || 'Sin ubicación'}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}