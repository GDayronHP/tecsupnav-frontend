import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Switch from '@components/Switch';

interface PreferencesElementProps {
    preferenceTitle?: string;
    iconName?: any;
    isOn: boolean;
    onToggle: (newState: boolean) => void;
}

export default function PreferencesElement({ preferenceTitle, iconName, isOn, onToggle }: PreferencesElementProps) {
    return (
        <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
                <Ionicons name={iconName} size={18} color="#6B7280" />
                <Text className="text-base text-neutral-700 ml-3">
                    {preferenceTitle}
                </Text>
            </View>
            <Switch
                isOn={isOn}
                onToggle={onToggle}
            />
        </View>
    )
}