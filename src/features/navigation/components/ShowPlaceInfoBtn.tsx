import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface ShowPlaceInfoCardProps {
    setShowPlaceInfo: (value: boolean) => void;
}

export default function ShowPlaceInfoCard({ setShowPlaceInfo }: ShowPlaceInfoCardProps) {
    return (
        <View style={{ position: 'absolute', bottom: 8, right: 16, zIndex: 50 }}>
            <TouchableOpacity
                onPress={() => setShowPlaceInfo(true)}
                style={{ backgroundColor: '#00BCD4', borderRadius: 28, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }}
                activeOpacity={0.8}
            >
                <Ionicons name="information-circle-outline" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}