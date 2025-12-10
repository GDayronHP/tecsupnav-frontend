import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Hooks
import { useProfile } from '../hooks/useProfile';
import { useFormattedProfile } from '../hooks/useFormattedProfile';

// Components
import PreferencesContainer from '../components/PreferencesContainer';
import RecentLocationsContainer from '../components/RecentLocationsContainer';
import ProfileHeaderContainer from '../components/ProfileHeaderContainer';
import AccountActionsContainer from '../components/AccountActionsContainer';
import Achievements from '../components/Achievements';
import Loading from '@components/Loading';

export default function ProfileScreen() {
    const { user, loading, error, refetch, handleLogout } = useProfile();
    const formattedUser = useFormattedProfile(user);

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
                
                {/* Botón de refrescar */}
                <TouchableOpacity
                    onPress={refetch}
                    className="ml-auto p-2"
                    disabled={loading}
                >
                    <Ionicons 
                        name="refresh" 
                        size={20} 
                        color={loading ? "#9CA3AF" : "#374151"} 
                    />
                </TouchableOpacity>
            </View>

            {/* Estado de carga */}
            {loading && (
                <Loading
                    title="Cargando perfil"
                />
            )}

            {/* Estado de error */}
            {error && !loading && (
                <View className="flex-1 justify-center items-center px-4">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="text-lg font-semibold text-neutral-900 mt-4 text-center">
                        Error al cargar el perfil
                    </Text>
                    <Text className="text-neutral-600 mt-2 text-center">
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={refetch}
                        className="mt-4 px-6 py-3 bg-primary-500 rounded-xl"
                    >
                        <Text className="text-white font-medium">Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Contenido principal */}
            {formattedUser && !loading && !error && (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                    {/* Profile Header */}
                    <ProfileHeaderContainer user={formattedUser} />                

                    {/* Achievements */}
                    {/* <Achievements /> */}

                    {/* Recent Locations */}
                    {/* <RecentLocationsContainer /> */}

                    {/* Preferences */}
                    <PreferencesContainer />

                    {/* Account Actions */}
                    <AccountActionsContainer user={formattedUser} handleLogout={handleLogout}/>

                    {/* Bottom spacing */}
                    <View className="h-6" />
                </ScrollView>
            )}

            {/* Estado vacío - sin datos pero sin error */}
            {!user && !loading && !error && (
                <View className="flex-1 justify-center items-center px-4">
                    <Ionicons name="person-circle-outline" size={48} color="#9CA3AF" />
                    <Text className="text-lg font-semibold text-neutral-900 mt-4 text-center">
                        No se encontraron datos del perfil
                    </Text>
                    <Text className="text-neutral-600 mt-2 text-center">
                        Verifica tu conexión e intenta nuevamente
                    </Text>
                    <TouchableOpacity
                        onPress={refetch}
                        className="mt-4 px-6 py-3 bg-primary-500 rounded-xl"
                    >
                        <Text className="text-white font-medium">Recargar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}