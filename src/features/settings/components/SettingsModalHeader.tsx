import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons';

interface SettingsModalHeaderProps {
    onClose: () => void;
}

export default function SettingsModalHeader({ onClose }: SettingsModalHeaderProps) {
    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
            <View className="flex-row items-center gap-2">
                <Ionicons name="settings-outline" size={20} color="#00BCD4" />
                <Text className="text-lg font-semibold text-neutral-900">Ajustes</Text>
            </View>
            <TouchableOpacity
                onPress={onClose}
                className="text-neutral-400"
            >
                <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
    )
}