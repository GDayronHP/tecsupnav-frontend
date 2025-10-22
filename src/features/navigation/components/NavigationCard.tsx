import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationV1 } from '../../../types/navigation';

interface NavigationCardProps {
    navigationData?: NavigationV1;
}

export default function NavigationCard({ navigationData }: NavigationCardProps) {
    const destinationName = navigationData?.destination?.nombre;
    const currentInstruction = navigationData?.instructions?.[0] || 'Sigue recto';

    return (
        <View className="absolute top-2 left-2 right-2 z-40">
            <View className="bg-white rounded-2xl px-4 py-3 items-center">
                <View>
                    {/* Destino (menos prominente) */}
                    {destinationName && (
                        <Text className="text-sm text-gray-500 mb-2">
                            Hacia {destinationName}
                        </Text>
                    )}
                    {/* Instrucción principal */}
                </View>
                <View className='flex flex-row'>
                    <View className="flex justify-center items-center">
                        <View className='w-10 h-10 bg-primary-500 rounded-full items-center justify-center mr-3'>
                            <Ionicons name="navigate" size={20} color="white" />
                        </View>
                    </View>
                    <Text className="text-xl font-bold text-gray-900 flex-1">
                        {currentInstruction}
                    </Text>
                </View>
            </View>
        </View>
    );
}
