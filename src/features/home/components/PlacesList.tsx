import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
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
          ) : (
            <PlacesContainer filteredLocations={filteredLocations} setSelectedPlace={setSelectedPlace} closeSidebar={closeSidebar} setShowPlaceInfo={setShowPlaceInfo} setShowRoute={setShowRoute} />
          )}
        </ScrollView>
      </View>
  )
}