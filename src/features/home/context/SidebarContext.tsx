import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlaceTypesService } from '../services/placeTypesService';
import { PlaceType } from '../../../types/place';
import { Alert } from 'react-native';

// Constants for AsyncStorage keys
const FILTERS_KEY = 'tecsupnav_filters';
const SELECTED_FILTER_KEY = 'tecsupnav_selected_filter';
const SEARCH_TEXT_KEY = 'tecsupnav_search_text';

interface SidebarContextType {
  // Filter data
  filters: PlaceType[];
  isFiltersLoaded: boolean;
  loadingFilters: boolean;
  
  // User preferences
  selectedFilter: string;
  searchText: string;
  
  // Actions
  setSelectedFilter: (filter: string) => void;
  setSearchText: (text: string) => void;
  refreshFilters: () => Promise<void>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  console.log('🏗️ SidebarProvider initialized');
  
  // State for filters
  const [filters, setFilters] = useState<PlaceType[]>([]);
  const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  
  // State for user preferences
  const [selectedFilter, setSelectedFilterState] = useState('Todos');
  const [searchText, setSearchTextState] = useState('');

  // Initialize data on provider mount (only once)
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      try {
        console.log('🚀 SidebarProvider: Starting data initialization');
        const initStart = Date.now();
        
        // Load cached data first
        const [savedFilters, savedSelectedFilter, savedSearchText] = await Promise.all([
          AsyncStorage.getItem(FILTERS_KEY),
          AsyncStorage.getItem(SELECTED_FILTER_KEY),
          AsyncStorage.getItem(SEARCH_TEXT_KEY),
        ]);

        if (!isMounted) return;
        
        let cachedFilters: PlaceType[] = [];
        
        // Apply cached data immediately
        if (savedFilters) {
          cachedFilters = JSON.parse(savedFilters);
          setFilters(cachedFilters);
          setIsFiltersLoaded(true);
          console.log('📱 SidebarProvider: Loaded cached filters:', cachedFilters.length);
        }
        
        if (savedSelectedFilter && savedSelectedFilter.trim() !== '' && savedSelectedFilter !== 'Todos') {
          setSelectedFilterState(savedSelectedFilter);
        }
        
        if (savedSearchText && savedSearchText.trim() !== '') {
          setSearchTextState(savedSearchText);
        }
        
        // Define fetchFreshFilters function inside initializeData
        const fetchFreshFilters = async (cachedFilters: PlaceType[], showLoading: boolean) => {
          if (showLoading) {
            setLoadingFilters(true);
          }
          
          try {
            console.log('🌐 SidebarProvider: Fetching fresh filters from API...');
            const apiStart = Date.now();
            
            const apiFilters = await usePlaceTypesService().getAll();
            console.log('🌐 SidebarProvider: API call completed in:', Date.now() - apiStart, 'ms');
            
            if (!isMounted) return;

            if (Array.isArray(apiFilters) && apiFilters.length > 0) {
              const hasChanged = JSON.stringify(cachedFilters) !== JSON.stringify(apiFilters);
              
              if (hasChanged || cachedFilters.length === 0) {
                console.log('✅ SidebarProvider: Updating filters:', hasChanged ? 'changed' : 'first load');
                setFilters(apiFilters);
                await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(apiFilters));
              } else {
                console.log('⚡ SidebarProvider: Filters unchanged, skipping update');
              }
              
              setIsFiltersLoaded(true);
            } else {
              console.warn('⚠️ SidebarProvider: Invalid API response for filters');
            }
          } catch (error) {
            console.error('❌ SidebarProvider: Error fetching filters:', error);
            
            if (cachedFilters.length === 0) {
              Alert.alert('Error', 'No se pudieron cargar los filtros.');
            }
          } finally {
            if (isMounted) {
              setLoadingFilters(false);
              if (!isFiltersLoaded) {
                setIsFiltersLoaded(true);
              }
            }
          }
        };

        // If we have cached data, we're already good to go
        if (cachedFilters.length > 0) {
          console.log('⚡ SidebarProvider: Cache initialization completed in:', Date.now() - initStart, 'ms');
          // Still fetch fresh data in background, but don't block UI
          setImmediate(() => fetchFreshFilters(cachedFilters, false));
          return;
        }
        
        // No cached data, need to fetch from API
        await fetchFreshFilters([], true);
        
      } catch (error) {
        console.error('❌ SidebarProvider: Error during initialization:', error);
        if (isMounted) {
          setIsFiltersLoaded(true); // Set as loaded even on error to not block UI
        }
      }
    };

    const fetchFreshFilters = async (cachedFilters: PlaceType[], showLoading: boolean) => {
      if (showLoading) {
        setLoadingFilters(true);
      }
      
      try {
        console.log('🌐 SidebarProvider: Fetching fresh filters from API...');
        const apiStart = Date.now();
        
        const apiFilters = await usePlaceTypesService().getAll();
        console.log('🌐 SidebarProvider: API call completed in:', Date.now() - apiStart, 'ms');
        
        if (!isMounted) return;

        if (Array.isArray(apiFilters) && apiFilters.length > 0) {
          const hasChanged = JSON.stringify(cachedFilters) !== JSON.stringify(apiFilters);
          
          if (hasChanged || cachedFilters.length === 0) {
            console.log('✅ SidebarProvider: Updating filters:', hasChanged ? 'changed' : 'first load');
            setFilters(apiFilters);
            await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(apiFilters));
          } else {
            console.log('⚡ SidebarProvider: Filters unchanged, skipping update');
          }
          
          setIsFiltersLoaded(true);
        } else {
          console.warn('⚠️ SidebarProvider: Invalid API response for filters');
        }
      } catch (error) {
        console.error('❌ SidebarProvider: Error fetching filters:', error);
        
        if (cachedFilters.length === 0) {
          Alert.alert('Error', 'No se pudieron cargar los filtros.');
        }
      } finally {
        if (isMounted) {
          setLoadingFilters(false);
          if (!isFiltersLoaded) {
            setIsFiltersLoaded(true);
          }
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - run only once on mount

  // Save selected filter to AsyncStorage
  useEffect(() => {
    if (selectedFilter === 'Todos') {
      AsyncStorage.removeItem(SELECTED_FILTER_KEY).catch(console.warn);
    } else {
      AsyncStorage.setItem(SELECTED_FILTER_KEY, selectedFilter).catch(console.warn);
    }
  }, [selectedFilter]);

  // Save search text to AsyncStorage
  useEffect(() => {
    if (searchText.trim()) {
      AsyncStorage.setItem(SEARCH_TEXT_KEY, searchText).catch(console.warn);
    } else {
      AsyncStorage.removeItem(SEARCH_TEXT_KEY).catch(console.warn);
    }
  }, [searchText]);

  // Handlers
  const setSelectedFilter = (filter: string) => {
    console.log('🎯 SidebarProvider: Filter selected:', filter);
    setSelectedFilterState(prev => prev === filter ? 'Todos' : filter);
  };

  const setSearchText = (text: string) => {
    console.log('🔍 SidebarProvider: Search text changed:', text.length, 'chars');
    setSearchTextState(text);
  };

  const refreshFilters = async () => {
    console.log('🔄 SidebarProvider: Manual refresh requested');
    setLoadingFilters(true);
    try {
      const apiFilters = await usePlaceTypesService().getAll();
      if (Array.isArray(apiFilters) && apiFilters.length > 0) {
        setFilters(apiFilters);
        await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(apiFilters));
        console.log('✅ SidebarProvider: Filters refreshed successfully');
      }
    } catch (error) {
      console.error('❌ SidebarProvider: Error refreshing filters:', error);
    } finally {
      setLoadingFilters(false);
    }
  };

  const value: SidebarContextType = {
    filters,
    isFiltersLoaded,
    loadingFilters,
    selectedFilter,
    searchText,
    setSelectedFilter,
    setSearchText,
    refreshFilters,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}