import { View, Text, TouchableOpacity, Animated } from 'react-native'
import React from 'react'
import StatsContainer from './StatsContainer';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileHeaderContainer() {
    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm" >
            <View className="items-center">
                {/* Avatar */}
                <Animated.View>
                    <TouchableOpacity
                        className="w-20 h-20 bg-primary-500 rounded-full justify-center items-center mb-4 relative"
                        onPress={() => {
                            // Aquí podrías abrir selector de imagen
                            console.log('Cambiar foto de perfil');
                        }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="person" size={40} color="white" />
                        {/* Edit indicator */}
                        <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full justify-center items-center shadow-sm border border-neutral-200">
                            <Ionicons name="camera" size={12} color="#6B7280" />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* User Info */}
                <Text className="text-2xl font-bold text-neutral-900 mb-1">
                    Estudiante Tecsup
                </Text>
                <Text className="text-lg text-neutral-600 mb-1">
                    Joseph Huayra Puma
                </Text>
                <Text className="text-sm text-neutral-500">
                    Miembro desde Junio 2025
                </Text>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    className="mt-4 px-6 py-2 bg-primary-50 rounded-full"
                    onPress={() => {
                        // Navegar a pantalla de edición de perfil
                        console.log('Editar perfil');
                    }}
                    activeOpacity={0.7}
                >
                    <Text className="text-primary-500 text-sm font-medium">Editar perfil</Text>
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <StatsContainer />

        </View>
    )
}