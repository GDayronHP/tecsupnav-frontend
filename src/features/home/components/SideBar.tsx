import React, { useState, useMemo, useEffect } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useFilterData from '../hooks/useFilterData';

// Components
import { placeTypesService } from '../services/placeTypesService';
import { PlaceType } from '@types/place';
import FilterChips from './FilterChips';
import Header from './Header';
import PlacesList from './PlacesList';

const FILTERS_KEY = 'tecsupnav_filters';
const SELECTED_FILTER_KEY = 'tecsupnav_selected_filter';
const SEARCH_TEXT_KEY = 'tecsupnav_search_text';

const Sidebar = (
  { closeSidebar, 
    locations, 
    loadingLocations, 
    setSelectedPlace, 
    setShowPlaceInfo, 
    setShowRoute
  }
) => {
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

  return (
    <View className="flex-1 bg-tecsup-card-bg  m-2">
    
      {/* Header */}
      <Header closeSidebar={closeSidebar} setSearchText={setSearchText} searchText={searchText} />

      {/* Filter Chips */}
      <FilterChips
        filters={filters}
        selectedFilter={selectedFilter}
        selectedFilterHandler={selectedFilterHandler}
      />  

      {/* Locations List con scroll vertical */}
      <PlacesList filteredLocations={filteredLocations} loadingLocations={loadingLocations} setSelectedPlace={setSelectedPlace} closeSidebar={closeSidebar} setShowPlaceInfo={setShowPlaceInfo} setShowRoute={setShowRoute} />

    </View>
  );
};

export default Sidebar;