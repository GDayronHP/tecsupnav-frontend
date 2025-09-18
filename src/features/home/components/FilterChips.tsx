import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { PlaceType } from '@types/place';

type FilterChipsProps = {
    filters: PlaceType[];
    selectedFilter: string;
    selectedFilterHandler: (filter: string) => void;
}

export default function FilterChips({ filters, selectedFilter, selectedFilterHandler }: FilterChipsProps) {
  return (
      <View className="bg-tecsup-card-bg py-5 px-4 border-b border-neutral-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <View className="flex-row gap-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => selectedFilterHandler(filter.nombre)}
                className={`px-4 py-1 rounded-button border ${selectedFilter === filter.nombre
                  ? 'bg-tecsup-cyan border-tecsup-cyan'
                  : 'bg-tecsup-card-bg border-neutral-300'
                  }`}
                activeOpacity={0.8}
              >
                <Text className={`text-label ${selectedFilter === filter.nombre
                  ? 'text-white'
                  : 'text-tecsup-text-secondary'
                  }`}>
                  {filter.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
  )
}