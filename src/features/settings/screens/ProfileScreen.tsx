import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Components
import PreferencesContainer from '../components/PreferencesContainer';
import RecentLocationsContainer from '../components/RecentLocationsContainer';
import ProfileHeaderContainer from '../components/ProfileHeaderContainer';
import AccountActionsContainer from '../components/AccountActionsContainer';
import Achievements from '../components/Achievements';

// Services
import useUserData from '../hooks/useUserData';

export default function ProfileScreen() {

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            {/* Header */}
            <View className="bg-white px-4 py-3 flex-row items-center shadow-sm">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3 p-2 -ml-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-neutral-900">Mi Perfil</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <ProfileHeaderContainer />                

                {/* Achievements */}
                <Achievements />

                {/* Recent Locations */}
                <RecentLocationsContainer />

                {/* Preferences */}
                <PreferencesContainer />

                {/* Account Actions */}
                <AccountActionsContainer />

                {/* Bottom spacing */}
                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}