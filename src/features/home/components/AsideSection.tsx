import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useFilterData from '../hooks/useFilterData';

import PlaceService from '../services/placeService';

// Components
import PlacesContainer from './PlacesContainer';
import { PlaceType, placeTypesService } from '../services/placeTypesService';

const FILTERS_KEY = 'tecsupnav_filters';
const SELECTED_FILTER_KEY = 'tecsupnav_selected_filter';
const SEARCH_TEXT_KEY = 'tecsupnav_search_text';

const Sidebar = ({ closeSidebar, locations, loadingLocations }) => {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<PlaceType[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos y filtro desde AsyncStorage al montar
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [savedFilters, savedSelectedFilter, savedSearchText] = await Promise.all([
          AsyncStorage.getItem(FILTERS_KEY),
          AsyncStorage.getItem(SELECTED_FILTER_KEY),
          AsyncStorage.getItem(SEARCH_TEXT_KEY),
        ]);

        if (isMounted) {
          if (savedFilters) setFilters(JSON.parse(savedFilters));
          if (savedSelectedFilter) setSelectedFilter(savedSelectedFilter);
          if (savedSearchText) setSearchText(savedSearchText);
        }

        // 2. Siempre pedir datos frescos de la API
        const placeService = new PlaceService();
        const apiFilters = await placeTypesService.getAll();
        if (isMounted) {
          setFilters(Array.isArray(apiFilters) ? apiFilters : []);
          // Guardar en AsyncStorage
          AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(apiFilters || []));
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    AsyncStorage.setItem(SELECTED_FILTER_KEY, selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    AsyncStorage.setItem(SEARCH_TEXT_KEY, searchText);
  }, [searchText]);

  const selectedFilterHandler = (filterName: string) => {
    setSelectedFilter((prev) => (prev === filterName ? 'Todos' : filterName));
  };

  // Filter by text
  const textFilteredLocations = useFilterData(locations, searchText);

  const filteredLocations = useMemo(() => {
    if (selectedFilter === 'Todos') return textFilteredLocations;
    return textFilteredLocations.filter(
      (location) =>
        location.tipo.nombre.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [textFilteredLocations, selectedFilter]);

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <View className="flex-1 bg-tecsup-surface m-2">
      {/* Header */}
      <View className="bg-tecsup-card-bg p-4 border-b border-neutral-200">
        {/* Header Top */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-tecsup-cyan rounded-full justify-center items-center mr-3">
              <Ionicons name="location-sharp" size={20} color="white" />
            </View>
            <Text className="text-title text-tecsup-text-primary">TecsupNav</Text>
          </View>
          <TouchableOpacity onPress={closeSidebar}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Student Info Card */}
        <View className="bg-tecsup-cyan rounded-card p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-white rounded-full justify-center items-center mr-3">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-subtitle font-semibold">Estudiante Tecsup</Text>
              <Text className="text-white text-caption text-opacity-80">Primer Ciclo - 2024</Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-row items-center bg-badge-nuevo-bg px-2 py-1 rounded-base">
              <Ionicons name="school" size={12} color="#ffffff" />
              <Text className="text-badge-nuevo-text text-xs ml-1">Nuevo</Text>
            </View>
            <View className="flex-row items-center bg-badge-activo-bg px-2 py-1 rounded-base">
              <Ionicons name="star" size={12} color="#92400e" />
              <Text className="text-badge-activo-text text-xs ml-1">Activo</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-tecsup-input-bg rounded-input px-3 py-2">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar aulas, laboratorios, servicios..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 text-tecsup-text-primary text-body"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="ml-2">
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips con scroll horizontal */}
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

      {/* Locations List con scroll vertical */}
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
            <PlacesContainer filteredLocations={filteredLocations} />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Sidebar;