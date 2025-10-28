import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

import { useAppSettings } from '@context/index';
import PreferencesElement from './PreferencesElement';

export default function PreferencesContainer() {
    
    const { settings, updateSetting } = useAppSettings();

    const togglePreference = (key: keyof typeof settings) => {
        updateSetting(key, !settings[key]);
    };

    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
                <Ionicons name="settings-outline" size={20} color="#6B7280" />
                <Text className="text-lg font-semibold text-neutral-900 ml-2">
                    Preferencias
                </Text>
            </View>

            <View className="space-y-1">

                <PreferencesElement preferenceTitle="Notificaciones" iconName={"notifications-outline"} isOn={settings.notifications} onToggle={() => togglePreference('notifications')} />
                <PreferencesElement preferenceTitle="Ubicación" iconName={"location-outline"} isOn={settings.location} onToggle={() => togglePreference('location')} />
                <PreferencesElement preferenceTitle="Modo de rendimiento" iconName={"speedometer-outline"} isOn={settings.performanceMode} onToggle={() => togglePreference('performanceMode')} />

                {settings.performanceMode && (
                    <View className="bg-amber-50 p-3 rounded-lg mt-2">
                        <View className="flex-row items-center">
                            <Ionicons name="flash" size={16} color="#F59E0B" />
                            <Text className="text-sm text-amber-700 ml-2">
                                Las animaciones están desactivadas para mejorar el rendimiento
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}