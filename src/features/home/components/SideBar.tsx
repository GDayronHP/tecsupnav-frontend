import { memo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Place } from '../../../types/place';
import FilterChips from './FilterChips';
import PlacesList from './PlacesList';
import SidebarHeader from './SidebarHeader';
import { useSidebar } from '../hooks/useSidebar';

interface SidebarProps {
  closeSidebar: () => void;
  locations: Place[];
  loadingLocations: boolean;
  setSelectedPlace: (place: Place) => void;
  setShowPlaceInfo: (show: boolean) => void;
  setShowRoute: (show: boolean) => void;
}

// Memoization helper for comparing locations
const areLocationsEqual = (prevLocations: Place[], nextLocations: Place[]) => {
  if (prevLocations.length !== nextLocations.length) return false;
  // Quick check - compare IDs only for performance
  return prevLocations.every((loc, index) => loc.id === nextLocations[index]?.id);
};

const Sidebar: React.FC<SidebarProps> = ({
  closeSidebar,
  locations,
  loadingLocations,
  setSelectedPlace,
  setShowPlaceInfo,
  setShowRoute,
}) => {
  // Performance tracking
  const renderStart = Date.now();
  console.log('🔄 Sidebar render, locations:', locations.length);
  
  // Hook personalizado con toda la lógica del sidebar
  const {
    selectedFilter,
    searchText,
    filters,
    loadingFilters,
    filteredLocations,
    selectedFilterHandler,
    handleSearchChange,
    isPreloaded,
  } = useSidebar({ locations });
  
  console.log('⚡ Sidebar render completed in:', Date.now() - renderStart, 'ms, preloaded:', isPreloaded);
  
  return (
    <View className="flex-1 bg-tecsup-card-bg m-2">
      <SidebarHeader 
        closeSidebar={closeSidebar} 
        setSearchText={handleSearchChange} 
        searchText={searchText} 
      />

      {/* Show loading if not preloaded yet */}
      {!isPreloaded ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="small" color="#00BCD4" />
          <Text className="text-sm text-neutral-600 mt-2">Cargando filtros...</Text>
        </View>
      ) : (
        <>
          {loadingFilters ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="small" color="#00BCD4" />
            </View>
          ) : filters.length > 0 ? (
            <FilterChips
              filters={filters}
              selectedFilter={selectedFilter}
              selectedFilterHandler={selectedFilterHandler}
            />
          ) : null}

          <PlacesList
            filteredLocations={filteredLocations}
            loadingLocations={loadingLocations}
            setSelectedPlace={setSelectedPlace}
            closeSidebar={closeSidebar}
            setShowPlaceInfo={setShowPlaceInfo}
            setShowRoute={setShowRoute}
          />
        </>
      )}
    </View>
  );
}; 

export default memo(Sidebar, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  const locationsEqual = areLocationsEqual(prevProps.locations, nextProps.locations);
  const loadingEqual = prevProps.loadingLocations === nextProps.loadingLocations;
  
  const shouldSkipRender = locationsEqual && loadingEqual;
  
  if (shouldSkipRender) {
    console.log('⚡ Sidebar memo: Skipping render');
  } else {
    console.log('🔄 Sidebar memo: Re-rendering due to:', {
      locationsChanged: !locationsEqual,
      loadingChanged: !loadingEqual
    });
  }
  
  return shouldSkipRender;
});