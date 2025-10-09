import { View, Text } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons';
import AnimatedButton from '@components/AnimatedButton';


const recentLocations = [
    {
        id: 1,
        name: 'Laboratorio de Mecatrónica',
        timeAgo: 'Hace 2 horas',
        visits: 5
    },
    {
        id: 2,
        name: 'Biblioteca Central',
        timeAgo: 'Ayer',
        visits: 12
    },
    {
        id: 3,
        name: 'Cafetería Principal',
        timeAgo: 'Hace 3 días',
        visits: 8
    }
];

export default function RecentLocationsContainer() {

    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text className="text-lg font-semibold text-neutral-900 ml-2">
                    Ubicaciones Recientes
                </Text>
            </View>

            {recentLocations.map((location, index) => (
                <AnimatedButton
                    key={location.id}
                    className={`flex-row items-center py-3 ${index !== recentLocations.length - 1 ? 'border-b border-neutral-100' : ''
                        }`}
                    onPress={() => console.log(`Navegar a ${location.name}`)}
                >
                    <View className="w-10 h-10 bg-primary-50 rounded-full justify-center items-center">
                        <Ionicons name="location-outline" size={20} color="#00BCD4" />
                    </View>

                    <View className="flex-1 ml-3">
                        <Text className="text-base font-medium text-neutral-900">
                            {location.name}
                        </Text>
                        <Text className="text-sm text-neutral-500">
                            {location.timeAgo}
                        </Text>
                    </View>

                    <Text className="text-sm text-neutral-400">
                        {location.visits} visitas
                    </Text>
                </AnimatedButton>
            ))}
        </View>
    )
}