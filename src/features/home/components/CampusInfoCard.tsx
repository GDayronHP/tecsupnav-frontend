import { View, Text } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'

interface CampusInfoCardProps {
    locations: any[];
}

export default function CampusInfoCard({ locations }: CampusInfoCardProps) {
    return (
        <View className="mx-4 my-2 bg-white rounded-2xl p-3 shadow-md">
            <View className="flex-row items-center mb-4">
                <View className="rounded-full justify-center items-center mr-3">
                    <Image
                        source={require("@assets/icons/logo.png")}
                        className="w-[50px] h-[50px]"
                        contentFit="contain"
                        transition={1000}
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-neutral-800 mb-1">
                        Campus Universitario
                    </Text>
                    <Text className="text-sm text-neutral-500">
                        {locations.length} ubicaciones disponibles
                    </Text>
                </View>
            </View>

            <View className="border-t border-neutral-200 pt-3">
                <Text className="text-base font-medium text-neutral-800 mb-3">
                    Leyenda:
                </Text>
                <View className="flex-row justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                        <Text className="text-sm text-neutral-500">Tu ubicación</Text>
                    </View>
                    <View className="flex-row items-center flex-1">
                        <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                        <Text className="text-sm text-neutral-500">Destino</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}