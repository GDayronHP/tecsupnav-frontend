import { useState, useCallback, useEffect, useMemo, useDeferredValue } from 'react'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { usePerformantAnimation } from '@hooks/usePerformantAnimation';
import { Gesture } from 'react-native-gesture-handler';
import useFilterData from './useFilterData';
import { usePlaceTypesService } from '../services/placeTypesService';
import { PlaceType, Place } from '../../../types/place';

import {
    useAnimatedStyle,
    runOnJS,
    interpolate,
    clamp,
} from "react-native-reanimated";

const SIDEBAR_WIDTH = 320;

// Constants for AsyncStorage keys
const FILTERS_KEY = 'tecsupnav_filters';
const SELECTED_FILTER_KEY = 'tecsupnav_selected_filter';
const SEARCH_TEXT_KEY = 'tecsupnav_search_text';

interface UseSidebarProps {
  locations: Place[];
}

export function useSidebar({ locations }: UseSidebarProps) {

    // Animation State
    const [isOpen, setIsOpen] = useState(false);

    // Sidebar Logic State
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState<PlaceType[]>([]);
    const [loadingFilters, setLoadingFilters] = useState(false);

    // Load filters and cached data
    useEffect(() => {
        let isMounted = true;
        let filterCache: PlaceType[] = [];

        const loadCachedData = async () => {
            try {
                const [savedFilters, savedSelectedFilter, savedSearchText] = await Promise.all([
                    AsyncStorage.getItem(FILTERS_KEY),
                    AsyncStorage.getItem(SELECTED_FILTER_KEY),
                    AsyncStorage.getItem(SEARCH_TEXT_KEY),
                ]);

                if (!isMounted) return;

                if (savedFilters) {
                    filterCache = JSON.parse(savedFilters);
                    setFilters(filterCache);
                }

                // Only restore filter if it exists and is not empty
                if (savedSelectedFilter && savedSelectedFilter.trim() !== '' && savedSelectedFilter !== 'Todos') {
                    setSelectedFilter(savedSelectedFilter);
                }
                
                // Only restore search text if it exists and is not empty
                if (savedSearchText && savedSearchText.trim() !== '') {
                    setSearchText(savedSearchText);
                }

                return filterCache;
            } catch (error) {
                console.warn('Error loading from AsyncStorage:', error);
                return [];
            }
        };

        const fetchFreshFilters = async (cachedFilters: PlaceType[]) => {
            if (cachedFilters.length === 0) {
                setLoadingFilters(true);
            }

            try {
                const apiFilters = await usePlaceTypesService().getAll();
                
                if (!isMounted) return;

                if (Array.isArray(apiFilters) && apiFilters.length > 0) {
                    const hasChanged = JSON.stringify(cachedFilters) !== JSON.stringify(apiFilters);
                    
                    if (hasChanged) {
                        setFilters(apiFilters);
                        await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(apiFilters));
                    }
                }
            } catch (error) {
                console.error('Error fetching filters:', error);

                if (cachedFilters.length === 0) {
                    Alert.alert('Error', 'No se pudieron cargar los filtros.');
                }
            } finally {
                if (isMounted) setLoadingFilters(false);
            }
        };

        loadCachedData().then(fetchFreshFilters);

        return () => {
            isMounted = false;
        };
    }, []);

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

    // Filter logic
    const deferredSearchText = useDeferredValue(searchText);
    const textFilteredLocations = useFilterData(locations, deferredSearchText);

    const filteredLocations = useMemo(() => {
        if (selectedFilter === 'Todos') return textFilteredLocations;
        
        const lowerFilter = selectedFilter.toLowerCase();
        return textFilteredLocations.filter(
            (location) => location.tipo?.nombre?.toLowerCase() === lowerFilter
        );
    }, [textFilteredLocations, selectedFilter]);

    // Handlers
    const selectedFilterHandler = useCallback((filterName: string) => {
        setSelectedFilter((prev) => (prev === filterName ? 'Todos' : filterName));
    }, []);

    const handleSearchChange = useCallback((text: string) => {
        setSearchText(text);
    }, []);

    // Animations
    const {
        animatedValue: translateX,
        animateWithSpring: animateTranslateX
    } = usePerformantAnimation(-SIDEBAR_WIDTH);

    const {
        animatedValue: overlayOpacity,
        animateWithTiming: animateOverlayOpacity,
        animateWithCallback: animateOverlayWithCallback
    } = usePerformantAnimation(0);


    // Sidebar animation handlers   
    const openSidebar = useCallback(() => {
        setIsOpen(true);
        animateTranslateX(0, {
            damping: 2000,
            stiffness: 200,
        });
        animateOverlayOpacity(0.5, { duration: 300 });
    }, [animateTranslateX, animateOverlayOpacity]);

    const closeSidebar = useCallback(() => {
        animateTranslateX(-SIDEBAR_WIDTH, {
            damping: 2000,
            stiffness: 200,
        });
        animateOverlayWithCallback(0, { duration: 300 }, () => {
            setIsOpen(false);
        });
    }, [animateTranslateX, animateOverlayWithCallback]);

    // Pan gesture
    const panGesture = Gesture.Pan()
        .enabled(true)
        .onUpdate((event) => {
            const { translationX } = event;
            if (isOpen) {
                const newTranslateX = clamp(translationX, -SIDEBAR_WIDTH, 0);
                translateX.value = newTranslateX;
                overlayOpacity.value = interpolate(
                    newTranslateX,
                    [-SIDEBAR_WIDTH, 0],
                    [0, 0.5]
                );
            } else {
                const newTranslateX = clamp(
                    -SIDEBAR_WIDTH + translationX,
                    -SIDEBAR_WIDTH,
                    0
                );
                translateX.value = newTranslateX;
                overlayOpacity.value = interpolate(
                    newTranslateX,
                    [-SIDEBAR_WIDTH, 0],
                    [0, 0.5]
                );
            }
        })
        .onEnd((event) => {
            const { translationX, velocityX } = event;
            const shouldOpen = translationX > SIDEBAR_WIDTH / 3 || velocityX > 500;
            const shouldClose = translationX < -SIDEBAR_WIDTH / 3 || velocityX < -500;

            if (!isOpen && shouldOpen) {
                runOnJS(openSidebar)();
            } else if (isOpen && shouldClose) {
                runOnJS(closeSidebar)();
            } else if (isOpen) {
                runOnJS(animateTranslateX)(0);
                runOnJS(animateOverlayOpacity)(0.5);
            } else {
                runOnJS(animateTranslateX)(-SIDEBAR_WIDTH);
                runOnJS(animateOverlayOpacity)(0);
            }
        });


    const edgeGesture = Gesture.Pan()
        .enabled(true)
        .activeOffsetX(10)
        .onUpdate((event) => {
            if (!isOpen && event.translationX > 0) {
                const progress = clamp(event.translationX / SIDEBAR_WIDTH, 0, 1);
                translateX.value = -SIDEBAR_WIDTH + progress * SIDEBAR_WIDTH;
                overlayOpacity.value = progress * 0.5;
            }
        })
        .onEnd((event) => {
            const { translationX, velocityX } = event;
            const shouldOpen = translationX > SIDEBAR_WIDTH / 4 || velocityX > 800;

            if (shouldOpen) {
                runOnJS(openSidebar)();
            } else {
                runOnJS(animateTranslateX)(-SIDEBAR_WIDTH);
                runOnJS(animateOverlayOpacity)(0);
            }
        });

    // Animated styles
    const sidebarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    return {
        // Animation
        isOpen,
        setIsOpen,
        openSidebar,
        closeSidebar,
        panGesture,
        edgeGesture,
        sidebarAnimatedStyle,
        overlayAnimatedStyle,
        
        // Sidebar Logic
        selectedFilter,
        searchText,
        filters,
        loadingFilters,
        filteredLocations,
        selectedFilterHandler,
        handleSearchChange,
    }
}