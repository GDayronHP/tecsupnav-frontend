import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../../../types/place';
import { NavigationV1 } from '../../../types/navigation';
import NavigationSpeech from './NavigationSpeech';

interface NavigationBottomBarProps {
    selectedPlace?: Place | null;
    handleCancel: () => void;
    navigation?: NavigationV1;
    navigationData?: NavigationV1;
}

export default function NavigationBottomBar({ selectedPlace, navigation, handleCancel, navigationData }: NavigationBottomBarProps) {
    return (
        <View className="absolute bottom-0 left-0 right-0 z-40">
            {/* Barra principal con información del lugar */}
            <View className="bg-white p-4 border-t border-neutral-200 flex flex-col gap-4 rounded-t-2xl" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8
            }}>
                {/* Header con nombre de la ubicación a navegar */}
                <View>
                    {/* Contenedor inferior: controles + info */}
                    <View className="flex-row items-center justify-between">
                        {/* Botón de cancelar navegación */}
                        <TouchableOpacity
                            onPress={handleCancel}
                            className="w-12 h-12 bg-white rounded-full shadow-md justify-center items-center border border-neutral-300 mr-3"
                            activeOpacity={0.85}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        {/* Tiempo y distancia */}
                        <View className="flex-row items-center justify-between flex-1 bg-tecsup-surface rounded-2xl py-3 px-5 shadow-sm">
                            {/* Tiempo estimado */}
                            <View className="flex-row items-center">
                                <View className="bg-success-500 rounded-full p-1.5 mr-2">
                                    <Ionicons name="leaf" size={14} color="white" />
                                </View>
                                <Text className="text-success-600 font-bold text-xl mr-1">
                                    {navigationData?.route ? Math.ceil(navigationData.route.tiempoEstimado / 60) : 0}
                                </Text>
                                <Text className="text-success-600 text-base font-medium">min</Text>
                            </View>

                            {/* Separador */}
                            <View className="w-px h-6 bg-neutral-300 mx-4" />

                            {/* Distancia restante */}
                            <View className="flex-row items-center">
                                <Ionicons name="walk" size={18} color="#00bcd4" />
                                <Text className="text-tecsup-text-primary font-semibold text-lg ml-2">
                                    {navigationData?.route ? (navigationData.route.distancia / 1000).toFixed(1) : '0.0'}
                                </Text>
                                <Text className="text-tecsup-text-secondary text-base ml-1">km</Text>
                            </View>
                        </View>

                        {/* Controles de voz o indicaciones */}
                        <View className="ml-3">
                            <NavigationSpeech currentInstruction={navigation?.instructions?.[0]} />
                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
}