import React, { useState, useEffect } from "react";
import { Keyboard, View, Text, TouchableOpacity, Alert, Button } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  clamp,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "../components/SideBar";
import ChatBot from "../components/ChatBot";
import Map from "../components/Map";
import EmergencyContactsModal from "../components/EmergencyContactsModal";
import MapSearchBar from "../components/MapSearchBar";
import PlaceInfoCard from "../components/PlaceInfoCard";
import { Image } from "expo-image";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlaceService from "../services/placeService";
import { router } from "expo-router";

import { usePlaces } from '@context/PlacesContext';

const LOCATIONS_KEY = 'tecsupnav_locations';
const SIDEBAR_WIDTH = 320;

export default function HomeScreen() {

  const [showMap, setShowMap] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const { locations, setLocations, selectedPlace, setSelectedPlace, showRoute, setShowRoute, showPlaceInfo, setShowPlaceInfo } = usePlaces();

  const [loadingLocations, setLoadingLocations] = useState(true);

  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;
    const loadLocations = async () => {
      try {
        // 1. Load locations from AsyncStorage
        const savedLocations = await AsyncStorage.getItem(LOCATIONS_KEY);
        if (isMounted && savedLocations) {
          setLocations(JSON.parse(savedLocations));
        }
        // 2. Fetch latest locations from API
        const placeService = new PlaceService();
        const apiLocations = await placeService.getAll();
        if (isMounted) {
          setLocations(Array.isArray(apiLocations) ? apiLocations : []);
          AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(apiLocations || []));
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar las ubicaciones.");
      } finally {
        if (isMounted) setLoadingLocations(false);
      }
    };
    loadLocations();
    return () => { isMounted = false; };
  }, []);

  const openSidebar = () => {
    setIsOpen(true);
    translateX.value = withSpring(0, {
      damping: 2000,
      stiffness: 200,
    });
    overlayOpacity.value = withTiming(0.5, { duration: 300 });
  };

  const closeSidebar = () => {
    translateX.value = withSpring(-SIDEBAR_WIDTH, {
      damping: 2000,
      stiffness: 200,
    });
    overlayOpacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setIsOpen)(false);
    });
  };

  const openChatBot = () => setIsChatBotVisible(true);
  const closeChatBot = () => setIsChatBotVisible(false);

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
        translateX.value = withSpring(0);
        overlayOpacity.value = withTiming(0.5);
      } else {
        translateX.value = withSpring(-SIDEBAR_WIDTH);
        overlayOpacity.value = withTiming(0);
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
        translateX.value = withSpring(-SIDEBAR_WIDTH);
        overlayOpacity.value = withTiming(0);
      }
    });

  const sidebarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const startNavigationMode = () => {
    setShowPlaceInfo(false);
    setTimeout(() => {
      setShowRoute(true);
      router.push('/navigation');
    }, 300);
  };
  return (
    <>
      <GestureHandlerRootView className="flex-1">
        <Animated.View className="flex-1 bg-tecsup-surface">
          <GestureDetector gesture={edgeGesture}>
            <Animated.View className="absolute left-0 top-0 bottom-0 w-5 z-30" />
          </GestureDetector>

          {/* Search Header */}
          <View className="flex-row flex items-center px-4 py-3 gap-2">
            <TouchableOpacity
              className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md"
              onPress={openSidebar}
            >
              <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>

            {/* MapSearchBar recibe locations como prop */}
            <MapSearchBar
              locations={locations}
              onSelect={place => {
                setSelectedPlace(place);
                setShowPlaceInfo(true);
                setShowRoute(true);
                Keyboard.dismiss();
              }}
            />

            <TouchableOpacity
              className="w-11 h-11 rounded-full bg-white justify-center items-center relative shadow-md"
              onPress={openChatBot}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#333" />
              <View className="w-2 h-2 rounded-full bg-error-500 absolute top-2 right-2" />
            </TouchableOpacity>
          </View>

          {/* Campus information */}
          <View className="mx-4 my-2 bg-white rounded-2xl p-3 shadow-md">
            <View className="flex-row items-center mb-4">
              <View className="rounded-full justify-center items-center mr-3">
                <Image
                  source={require("@assets/icons/logo.png")}
                  className="w-[50px] h-[50px]"
                  contentFit="contain"
                  transition={1000}
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-neutral-800 mb-1">
                  Campus Universitario
                </Text>
                <Text className="text-sm text-neutral-500">
                  {locations.length} ubicaciones disponibles
                </Text>
              </View>
            </View>

            <View className="border-t border-neutral-200 pt-3">
              <Text className="text-base font-medium text-neutral-800 mb-3">
                Leyenda:
              </Text>
              <View className="flex-row justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  <Text className="text-sm text-neutral-500">Tu ubicación</Text>
                </View>
                <View className="flex-row items-center flex-1">
                  <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  <Text className="text-sm text-neutral-500">Destino</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Placeholder map */}
          <View className="flex-1 mx-4 mb-5 rounded-2xl overflow-hidden relative">
            {/* <Button title="Desmontar y montar mapa" onPress={() => {
              setShowMap(false)
              setTimeout(() => setShowMap(true), 100)
            }
            } />
            {showMap && <Map locations={locations} selectedPlace={selectedPlace} showRoute={showRoute} />} */}

            <Map locations={locations} selectedPlace={selectedPlace} showRoute={showRoute} />
            {/* Emergency Button */}
            <View className="absolute right-4 bottom-4">
              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-error-500 justify-center items-center shadow-lg"
                onPress={() => {
                  setShowEmergencyModal(true);
                }}
                style={{ zIndex: 1000 }}
              >
                <Ionicons name="flash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Place Info Card (modal con overlay) */}
          <PlaceInfoCard
            place={selectedPlace}
            isVisible={showPlaceInfo && !!selectedPlace}
            onClose={() => setShowPlaceInfo(false)}
            onRoutePress={startNavigationMode}
          />

          {/* Overlay con gesto */}
          {isOpen && (
            <GestureDetector gesture={panGesture}>
              <Animated.View
                className="absolute inset-0 bg-black z-40"
                style={overlayAnimatedStyle}
              >
                <TouchableOpacity
                  className="flex-1"
                  onPress={closeSidebar}
                  activeOpacity={1}
                />
              </Animated.View>
            </GestureDetector>
          )}
        </Animated.View>
        {/* Sidebar */}
        {isOpen && (
          <Animated.View
            className="absolute left-0 top-0 bottom-0 bg-white z-50 shadow-2xl"
            style={[{ width: SIDEBAR_WIDTH }, sidebarAnimatedStyle]}
          >
            <Sidebar
              closeSidebar={closeSidebar}
              locations={locations}
              loadingLocations={loadingLocations}
              setSelectedPlace={setSelectedPlace}
              setShowPlaceInfo={setShowPlaceInfo}
              setShowRoute={setShowRoute}
            />
          </Animated.View>
        )}
      </GestureHandlerRootView>

      <ChatBot isVisible={isChatBotVisible} onClose={closeChatBot} />

      {/* Emergency Modal */}
      <EmergencyContactsModal
        visible={showEmergencyModal}
        onClose={() => {
          setShowEmergencyModal(false);
        }}
      />
    </>
  );
}
