import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFilterData from '../hooks/useFilterData';

const Sidebar = ({ closeSidebar }) => {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchText, setSearchText] = useState('');

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'pabellon', label: 'Pabellón' },
    { id: 'aula', label: 'Aula' },
    { id: 'laboratorio', label: 'Laboratorio' },
    { id: 'servicio', label: 'Servicio' },
  ];

  const locations = [
    { id: 1, name: 'Laboratorio de Mecatrónica', type: 'Laboratorio', floor: '2do piso', category: 'laboratorio' },
    { id: 2, name: 'Biblioteca Central', type: 'Servicio', floor: '1er piso', category: 'servicio' },
    { id: 3, name: 'Laboratorio de Sistemas', type: 'Laboratorio', floor: '3er piso', category: 'laboratorio' },
    { id: 4, name: 'Aula 201', type: 'Aula', floor: '2do piso', category: 'aula' },
    { id: 5, name: 'Cafetería Principal', type: 'Servicio', floor: '1er piso', category: 'servicio' },
    { id: 6, name: 'Laboratorio de Química', type: 'Laboratorio', floor: '1er piso', category: 'laboratorio' },
    { id: 7, name: 'Aula 305', type: 'Aula', floor: '3er piso', category: 'aula' },
    { id: 8, name: 'Pabellón A', type: 'Pabellón', floor: 'Planta baja', category: 'pabellon' },
    { id: 9, name: 'Servicios Estudiantiles', type: 'Servicio', floor: '2do piso', category: 'servicio' },
    { id: 10, name: 'Laboratorio de Redes', type: 'Laboratorio', floor: '2do piso', category: 'laboratorio' },
  ];

  const getBadgeClasses = (category) => {
    const styles = {
      laboratorio: 'bg-badge-laboratorio-bg text-badge-laboratorio-text',
      servicio: 'bg-badge-servicio-bg text-badge-servicio-text',
      aula: 'bg-badge-activo-bg text-badge-activo-text',
      pabellon: 'bg-badge-nuevo-bg text-badge-nuevo-text',
      default: 'bg-badge-nuevo-bg text-badge-nuevo-text',
    };
    return styles[category] || styles.default;
  };

  const searchFilteredLocations = useFilterData(locations, searchText);

  const filteredLocations = useMemo(() => {
    const dataToFilter = searchFilteredLocations || locations;
    
    if (selectedFilter === 'Todos') {
      return dataToFilter;
    }
    
    return dataToFilter.filter((location) => 
      location.category === selectedFilter.toLowerCase()
    );
  }, [searchFilteredLocations, selectedFilter, locations]);

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

      {/* Filter Chips */}
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
                onPress={() => setSelectedFilter(filter.label)}
                className={`px-4 py-1 rounded-button border ${
                  selectedFilter === filter.label
                    ? 'bg-tecsup-cyan border-tecsup-cyan'
                    : 'bg-tecsup-card-bg border-neutral-300'
                }`}
                activeOpacity={0.8}
              >
                <Text className={`text-label ${
                  selectedFilter === filter.label
                    ? 'text-white'
                    : 'text-tecsup-text-secondary'
                }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Locations List */}
      <ScrollView className="flex-1 bg-tecsup-card-bg p-4" contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-tecsup-text-muted text-caption font-medium uppercase tracking-wide">
            UBICACIONES DEL CAMPUS
          </Text>
          <Text className="text-tecsup-text-muted text-caption">
            {filteredLocations.length} resultado{filteredLocations.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filteredLocations.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Ionicons name="search" size={48} color="#94a3b8" />
            <Text className="text-tecsup-text-muted text-body mt-4 text-center">
              No se encontraron ubicaciones
            </Text>
            <Text className="text-tecsup-text-muted text-caption mt-2 text-center">
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        ) : (
          filteredLocations.map((location, index) => (
            <View key={location.id} className="mb-4">
              {/* Location Info */}
              <View className="mb-2">
                <Text className="text-subtitle text-tecsup-text-primary font-medium mb-1">
                  {location.name}
                </Text>
                <View className="flex-row items-center">
                  <View className={`px-2 py-1 rounded-base mr-2 ${getBadgeClasses(location.category)}`}>
                    <Text className="text-xs font-medium">{location.type}</Text>
                  </View>
                  <Text className="text-tecsup-text-muted text-caption">• {location.floor}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity className="flex-1 bg-tecsup-surface py-3 rounded-button flex-row items-center justify-center">
                  <Ionicons name="eye" size={16} color="#0ea5e9" />
                  <Text className="text-tecsup-text-link text-label ml-2">Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 bg-tecsup-cyan py-3 rounded-button flex-row items-center justify-center">
                  <Ionicons name="navigate" size={16} color="white" />
                  <Text className="text-white text-label ml-2">Ruta</Text>
                </TouchableOpacity>
              </View>

              {/* Separator */}
              {index !== filteredLocations.length - 1 && (
                <View className="border-b border-neutral-100 mt-3" />
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Sidebar;