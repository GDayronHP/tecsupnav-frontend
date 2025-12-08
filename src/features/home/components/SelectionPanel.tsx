import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'

interface SelectionPanelProps {
    isFloorPanelExpanded: boolean;
    setIsFloorPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    selectedFloor: number | null;
    setSelectedFloor: React.Dispatch<React.SetStateAction<number | null>>;
    availableFloors: number[];
}

export default function SelectionPanel({ isFloorPanelExpanded, setIsFloorPanelExpanded, selectedFloor, setSelectedFloor, availableFloors }: SelectionPanelProps) {

  return (
    <View className="absolute right-3 top-16">
          {!isFloorPanelExpanded ? (
            // Compact button to expand panel
            <TouchableOpacity
              onPress={() => setIsFloorPanelExpanded(true)}
              className="bg-white rounded-button shadow-card w-12 h-12 justify-center items-center"
              activeOpacity={0.7}
            >
              <Ionicons name="layers" size={22} color="#00bcd4" />
              {selectedFloor !== null && (
                <View className="absolute -top-1 -right-1 bg-info-600 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-caption font-semibold text-sm">
                    {selectedFloor === 0 ? 'PB' : selectedFloor}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            // Expanded panel
            <View className="bg-white rounded-card p-2 shadow-card">
              {/* Header with close button */}
              <View className="flex-row items-center justify-between mb-2 px-2">
                <Text className="text-label text-neutral-700 font-semibold">Pisos</Text>
                <TouchableOpacity
                  onPress={() => setIsFloorPanelExpanded(false)}
                  className="p-1"
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* "Todos" Button*/}
              <TouchableOpacity
                onPress={() => {
                  setSelectedFloor(null);
                }}
                className={`py-2.5 px-3 rounded-button mb-1 ${
                  selectedFloor === null ? 'bg-primary-500' : 'bg-transparent'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-label font-semibold text-center ${
                    selectedFloor === null ? 'text-white' : 'text-neutral-500'
                  }`}
                >
                  Todos
                </Text>
              </TouchableOpacity>

              {/* Floor Buttons */}
              {availableFloors.map((floor) => (
                <TouchableOpacity
                  key={floor}
                  onPress={() => {
                    setSelectedFloor(floor);
                  }}
                  className={`py-2.5 px-3 rounded-button mb-1 flex-row items-center justify-center ${
                    selectedFloor === floor ? 'bg-primary-500' : 'bg-transparent'
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="layers-outline"
                    size={16}
                    color={selectedFloor === floor ? '#fff' : '#6B7280'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    className={`text-label font-semibold ${
                      selectedFloor === floor ? 'text-white' : 'text-neutral-500'
                    }`}
                  >
                    {floor === 0 ? 'Planta Baja' : `Piso ${floor}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
  )
}