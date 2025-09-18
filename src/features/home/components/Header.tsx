import { View, Text, TouchableOpacity } from 'react-native'
import SideBarSearchBar from './SideBarSearchBar';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'

type HeaderProps = {
    closeSidebar: () => void;
    setSearchText: (text: string) => void;
    searchText: string;
}

export default function Header({ closeSidebar, setSearchText, searchText }: HeaderProps) {
    return (
        <>
            <View className="bg-tecsup-surface mb-2">
                {/* Header Top */}
                <View className="bg-tecsup-card-bg p-4 border-b border-neutral-200">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-tecsup-cyan rounded-full justify-center items-center mr-3">
                                <Ionicons name="location-sharp" size={20} color="white" />
                            </View>
                            <Text className="text-title text-tecsup-text-primary">TecsupNav</Text>
                        </View>
                        <TouchableOpacity onPress={closeSidebar}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Student Info Card */}
                    <View className="bg-tecsup-cyan rounded-card p-4 mb-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-white rounded-full justify-center items-center mr-3">
                                <Ionicons name="person" size={20} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-subtitle font-semibold">Estudiante Tecsup</Text>
                                <Text className="text-white text-caption text-opacity-80">Primer Ciclo - 2024</Text>
                            </View>
                        </View>

                        <View className="flex-row gap-2">
                            <View className="flex-row items-center bg-badge-nuevo-bg px-2 py-1 rounded-base">
                                <Ionicons name="school" size={12} color="#ffffff" />
                                <Text className="text-badge-nuevo-text text-xs ml-1">Nuevo</Text>
                            </View>
                            <View className="flex-row items-center bg-badge-activo-bg px-2 py-1 rounded-base">
                                <Ionicons name="star" size={12} color="#92400e" />
                                <Text className="text-badge-activo-text text-xs ml-1">Activo</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            {/* Search Bar */}
            <SideBarSearchBar setSearchText={setSearchText} searchText={searchText} />
            <View className="bg-tecsup-card-bg pt-2 border-b border-neutral-200" />
        </>
    )
}