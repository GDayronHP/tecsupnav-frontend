import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import MapSearchBar from './MapSearchBar';
import { Place } from '@types/place';

interface HomeHeaderProps {
    openSidebar: () => void;
    openChatBot: () => void;
    locations: Place[];
    handlePlaceSelect: (place: Place) => void;
}

export default function HomeHeader({ openSidebar, openChatBot, locations, handlePlaceSelect }: HomeHeaderProps) {
    return (
        <View className="flex-row items-center px-4 py-3 gap-2">
            <TouchableOpacity
                className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md"
                onPress={openSidebar}
                activeOpacity={0.7}
            >
                <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>

            <MapSearchBar
                locations={locations}
                onSelect={handlePlaceSelect}
            />

            <TouchableOpacity
                className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md"
                onPress={openChatBot}
                activeOpacity={0.7}
            >
                <Ionicons name="chatbubble-outline" size={24} color="#333" />
                <View className="w-2 h-2 rounded-full bg-error-500 absolute top-2 right-2" />
            </TouchableOpacity>
        </View>
    )
}