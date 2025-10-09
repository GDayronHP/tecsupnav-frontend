import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import PlacesContainer from './PlacesContainer'

type PlacesListProps = {
    filteredLocations: any[];
    loadingLocations: boolean;
    setSelectedPlace: (place: any) => void;
    closeSidebar: () => void;
    setShowPlaceInfo: (show: boolean) => void;
    setShowRoute: (show: boolean) => void;
}

export default function PlacesList({ filteredLocations, loadingLocations, setSelectedPlace, closeSidebar, setShowPlaceInfo, setShowRoute }: PlacesListProps) {
  return (
    <View style={{ flex: 1 }}>
        <ScrollView
          className="bg-tecsup-card-bg p-4"
          contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
        >
          {loadingLocations ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#00BCD4" />
              <Text className="text-tecsup-text-muted text-body mt-4 text-center">
                Cargando ubicaciones...
              </Text>
            </View>
          ) : filteredLocations.length > 0 ? (
            <PlacesContainer filteredLocations={filteredLocations} setSelectedPlace={setSelectedPlace} closeSidebar={closeSidebar} setShowPlaceInfo={setShowPlaceInfo} setShowRoute={setShowRoute} />
          ) : (
            <View className="flex-1 justify-center items-center py-8">
              <View className="w-16 h-16 bg-neutral-100 rounded-full justify-center items-center mb-4">
                <Ionicons name="search-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-neutral-600 font-medium text-lg mb-2 text-center">
                No se encontró el lugar que buscas
              </Text>
              <Text className="text-neutral-400 text-sm text-center px-4">
                Intenta con otro término de búsqueda o cambia los filtros seleccionados
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
  )
}