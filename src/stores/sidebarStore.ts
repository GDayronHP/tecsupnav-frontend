import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceType } from '../types/place';

interface SidebarStore {
  filters: PlaceType[];
  selectedFilter: string;
  searchText: string;
  isFiltersLoaded: boolean;
  loadingFilters: boolean;
  
  // Actions
  setFilters: (filters: PlaceType[]) => void;
  setSelectedFilter: (filter: string) => void;
  setSearchText: (text: string) => void;
  setLoadingFilters: (loading: boolean) => void;
  resetFilters: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      filters: [],
      selectedFilter: 'Todos',
      searchText: '',
      isFiltersLoaded: false,
      loadingFilters: false,
      
      setFilters: (filters) => set({ filters, isFiltersLoaded: true }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
      setSearchText: (text) => set({ searchText: text }),
      setLoadingFilters: (loading) => set({ loadingFilters: loading }),
      resetFilters: () => set({
        selectedFilter: 'Todos',
        searchText: ''
      })
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedFilter: state.selectedFilter,
        searchText: state.searchText,
        filters: state.filters
      })
    }
  )
);
