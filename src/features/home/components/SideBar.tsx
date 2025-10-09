import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFilterData from '../hooks/useFilterData';
import { placeTypesService } from '../services/placeTypesService';
import { PlaceType } from '@types/place';
import FilterChips from './FilterChips';
import Header from './Header';
import PlacesList from './PlacesList';

const FILTERS_KEY = 'tecsupnav_filters';
const SELECTED_FILTER_KEY = 'tecsupnav_selected_filter';
const SEARCH_TEXT_KEY = 'tecsupnav_search_text';

const Sidebar = ({
  closeSidebar,
  locations,
  loadingLocations,
  setSelectedPlace,
  setShowPlaceInfo,
  setShowRoute,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<PlaceType[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFilters = async () => {
      try {
        const [savedFilters, savedSelectedFilter, savedSearchText] = await Promise.all([
          AsyncStorage.getItem(FILTERS_KEY),
          AsyncStorage.getItem(SELECTED_FILTER_KEY),
          AsyncStorage.getItem(SEARCH_TEXT_KEY),
        ]);

        if (!isMounted) return;

        if (savedFilters) setFilters(JSON.parse(savedFilters));
        if (savedSelectedFilter) setSelectedFilter(savedSelectedFilter);
        if (savedSearchText) setSearchText(savedSearchText);
      } catch (error) {
        console.warn('Error cargando desde AsyncStorage', error);
      } finally {
        if (isMounted) setLoadingFilters(false);
      }
    };

    const updateFilters = async () => {
      try {
        const apiFilters = await placeTypesService.getAll();
        if (isMounted && Array.isArray(apiFilters)) {
          setFilters(apiFilters);
          AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(apiFilters)).catch(console.warn);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos.');
      }
    };

    loadFilters().then(updateFilters);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SELECTED_FILTER_KEY, selectedFilter).catch(console.warn);
  }, [selectedFilter]);

  useEffect(() => {
    AsyncStorage.setItem(SEARCH_TEXT_KEY, searchText).catch(console.warn);
  }, [searchText]);

  const deferredSearchText = useDeferredValue(searchText);
  const textFilteredLocations = useFilterData(locations, deferredSearchText);

  const filteredLocations = useMemo(() => {
    if (selectedFilter === 'Todos') return textFilteredLocations;
    return textFilteredLocations.filter(
      (location) => location.tipo.nombre.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [textFilteredLocations, selectedFilter]);

  const selectedFilterHandler = (filterName: string) => {
    setSelectedFilter((prev) => (prev === filterName ? 'Todos' : filterName));
  };

  return (
    <View className="flex-1 bg-tecsup-card-bg m-2">
      <Header closeSidebar={closeSidebar} setSearchText={setSearchText} searchText={searchText} />

      {loadingFilters ? (
        <View className="items-center justify-center py-4">
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      ) : (
        <FilterChips
          filters={filters}
          selectedFilter={selectedFilter}
          selectedFilterHandler={selectedFilterHandler}
        />
      )}

      <PlacesList
        filteredLocations={filteredLocations}
        loadingLocations={loadingLocations}
        setSelectedPlace={setSelectedPlace}
        closeSidebar={closeSidebar}
        setShowPlaceInfo={setShowPlaceInfo}
        setShowRoute={setShowRoute}
      />
    </View>
  );
};

export default React.memo(Sidebar);
