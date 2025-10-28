import { useState, useCallback, useMemo, useDeferredValue } from 'react'
import { InteractionManager } from 'react-native';
import { usePerformantAnimation } from '@hooks/usePerformantAnimation';
import { Gesture } from 'react-native-gesture-handler';
import useFilterData from './useFilterData';
import { Place } from '../../../types/place';
import { useSidebarContext } from '../context/SidebarContext';

import {
    useAnimatedStyle,
    runOnJS,
    interpolate,
    clamp,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const SIDEBAR_WIDTH = 320;

interface UseSidebarProps {
  locations: Place[];
}

export function useSidebar({ locations }: UseSidebarProps) {
    console.log('🏗️ useSidebar hook called with', locations.length, 'locations');

    // Animation State - this is the only local state we need
    const [isOpen, setIsOpen] = useState(false);

    // Get all filter data from context (no local state needed)
    const {
        filters,
        isFiltersLoaded,
        loadingFilters,
        selectedFilter,
        searchText,
        setSelectedFilter: setSelectedFilterContext,
        setSearchText: setSearchTextContext,
    } = useSidebarContext();

    // Highly optimized filter logic with deferred processing
    const deferredSearchText = useDeferredValue(searchText);
    const textFilteredLocations = useFilterData(locations, deferredSearchText);

    const filteredLocations = useMemo(() => {
        // Don't process during animations for better performance
        const start = Date.now();
        
        if (selectedFilter === 'Todos') {
            console.log('⚡ Filter time (no filter):', Date.now() - start, 'ms');
            return textFilteredLocations;
        }
        
        // Cache the lowercase filter to avoid repeated calls
        const lowerFilter = selectedFilter.toLowerCase();
        const result = textFilteredLocations.filter((location) => {
            // Optimized comparison with early returns
            const tipoNombre = location.tipo?.nombre;
            return tipoNombre && tipoNombre.toLowerCase() === lowerFilter;
        });
        
        const elapsed = Date.now() - start;
        if (elapsed > 5) { // Only log if it takes more than 5ms
            console.log('⚡ Filter time (with filter):', elapsed, 'ms, results:', result.length);
        }
        return result;
    }, [textFilteredLocations, selectedFilter]);

    // Optimized handlers with performance tracking
    const selectedFilterHandler = useCallback((filterName: string) => {
        console.log('🎯 Filter selected:', filterName);
        const start = Date.now();
        setSelectedFilterContext(filterName);
        console.log('⚡ Filter change time:', Date.now() - start, 'ms');
    }, [setSelectedFilterContext]);

    const handleSearchChange = useCallback((text: string) => {
        console.log('🔍 Search text changed:', text.length, 'chars');
        setSearchTextContext(text);
    }, [setSearchTextContext]);

    // High-performance animations using native driver
    const {
        animatedValue: translateX,
        animateWithSpring: animateTranslateX
    } = usePerformantAnimation(-SIDEBAR_WIDTH);

    const {
        animatedValue: overlayOpacity,
        animateWithTiming: animateOverlayOpacity,
        animateWithCallback: animateOverlayWithCallback
    } = usePerformantAnimation(0);


    // Sidebar animation handlers with performance tracking
    const openSidebar = useCallback(() => {
        console.log('🚪 Opening sidebar... filters loaded:', isFiltersLoaded);
        const start = Date.now();
        
        // Set open state immediately for instant response
        setIsOpen(true);
        
        // Use aggressive spring settings for snappy performance
        const animationConfig = {
            damping: 3000,
            stiffness: 400,
            mass: 1,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
        };
        
        // Start animations immediately, don't wait for data loading
        animateTranslateX(0, animationConfig);
        animateOverlayOpacity(0.5, { 
            duration: 150,
        });
        
        // Track animation start time on next frame
        requestAnimationFrame(() => {
            console.log('⚡ Sidebar open animation started in:', Date.now() - start, 'ms');
        });
    }, [animateTranslateX, animateOverlayOpacity, isFiltersLoaded]);

    const closeSidebar = useCallback(() => {
        console.log('🚪 Closing sidebar...');
        const start = Date.now();
        
        // Fast close animation
        animateTranslateX(-SIDEBAR_WIDTH, {
            damping: 3500,
            stiffness: 500,
            mass: 1,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
        });
        
        animateOverlayWithCallback(0, { duration: 120 }, () => {
            setIsOpen(false);
            console.log('⚡ Sidebar closed in:', Date.now() - start, 'ms');
        });
    }, [animateTranslateX, animateOverlayWithCallback]);

    // Optimized pan gesture with better performance
    const panGesture = Gesture.Pan()
        .enabled(true)
        .shouldCancelWhenOutside(false)
        .onUpdate((event) => {
            'worklet';
            const { translationX } = event;
            
            if (isOpen) {
                const newTranslateX = clamp(translationX, -SIDEBAR_WIDTH, 0);
                translateX.value = newTranslateX;
                overlayOpacity.value = interpolate(
                    newTranslateX,
                    [-SIDEBAR_WIDTH, 0],
                    [0, 0.5],
                    'clamp'
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
                    [0, 0.5],
                    'clamp'
                );
            }
        })
        .onEnd((event) => {
            'worklet';
            const { translationX, velocityX } = event;
            const shouldOpen = translationX > SIDEBAR_WIDTH / 3 || velocityX > 300;
            const shouldClose = translationX < -SIDEBAR_WIDTH / 3 || velocityX < -300;

            if (!isOpen && shouldOpen) {
                runOnJS(openSidebar)();
            } else if (isOpen && shouldClose) {
                runOnJS(closeSidebar)();
            } else if (isOpen) {
                // Fast spring back to open position
                translateX.value = withSpring(0, { damping: 3000, stiffness: 400 });
                overlayOpacity.value = withTiming(0.5, { duration: 100 });
            } else {
                // Fast spring back to closed position
                translateX.value = withSpring(-SIDEBAR_WIDTH, { damping: 3000, stiffness: 400 });
                overlayOpacity.value = withTiming(0, { duration: 100 });
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
        
        // Performance
        isPreloaded: isFiltersLoaded,
    }
}