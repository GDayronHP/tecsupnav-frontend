import { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
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

const Sidebar: React.FC<SidebarProps> = ({
  closeSidebar,
  locations,
  loadingLocations,
  setSelectedPlace,
  setShowPlaceInfo,
  setShowRoute,
}) => {
  // Hook personalizado con toda la lógica del sidebar
  const {
    selectedFilter,
    searchText,
    filters,
    loadingFilters,
    filteredLocations,
    selectedFilterHandler,
    handleSearchChange,
  } = useSidebar({ locations });
  
  return (
    <View className="flex-1 bg-tecsup-card-bg m-2">
      <SidebarHeader 
        closeSidebar={closeSidebar} 
        setSearchText={handleSearchChange} 
        searchText={searchText} 
      />

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
    </View>
  );
}; 

export default memo(Sidebar);