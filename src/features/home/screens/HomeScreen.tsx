import React, { useState, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Hooks & Services
import { useSidebar } from "../hooks/useSidebar";
import { useModal } from "../hooks/useModal";
import { useLocation } from "../hooks/useLocation";
import usePlaceNavigation from "../hooks/usePlaceNavigation";

// Components
import Sidebar from "../components/SideBar";
import EmergencyContactsModal from "../components/EmergencyContactsModal";
import PlaceInfoCard from "../components/PlaceInfoCard";
import HomeHeader from "../components/HomeHeader";
import CampusInfoCard from "../components/CampusInfoCard";
import MapContainer from "../components/MapContainer";

// Stores
import { usePlacesStore, useChatbotStore } from "@/stores";
import Backdrop from "@components/Backdrop";

// Constants
const SIDEBAR_WIDTH = 320;

export default function HomeScreen() {

  // ChatBot Modal State
  const openChatBot = useChatbotStore(s => s.openChatBot);

  // Map & Places State - Selective subscriptions
  const selectedPlace = usePlacesStore(s => s.selectedPlace);
  const showPlaceInfo = usePlacesStore(s => s.showPlaceInfo);
  const setShowPlaceInfo = usePlacesStore(s => s.setShowPlaceInfo);
  const showRoute = usePlacesStore(s => s.showRoute);
  const setSelectedPlace = usePlacesStore(s => s.setSelectedPlace);
  const setShowRoute = usePlacesStore(s => s.setShowRoute);

  // Location states
  const { locations, loadingLocations } = useLocation();

  // Sidebar State & Gestures
  const { isOpen, openSidebar, closeSidebar, panGesture, edgeGesture, sidebarAnimatedStyle } = useSidebar({ locations });

  // Modal Handlers
  const { showEmergencyModal, setShowEmergencyModal, closeEmergencyModal, closePlaceInfoCard } = useModal();

  const { handlePlaceSelect, startNavigationMode } = usePlaceNavigation();

  return (
    <>
      <GestureHandlerRootView className="flex-1">
        <Animated.View className="flex-1 bg-tecsup-surface">
          {/* Edge Gesture Detector */}
          <GestureDetector gesture={edgeGesture}>
            <Animated.View className="absolute left-0 top-0 bottom-0 w-5 z-30" />
          </GestureDetector>

          {/* Header */}
          <HomeHeader
            openSidebar={openSidebar}
            openChatBot={openChatBot}
            locations={locations}
            handlePlaceSelect={handlePlaceSelect}
          />

          {/* Campus Info Card */}
          <CampusInfoCard locations={locations} />

          {/* Map Container */}
          <MapContainer
            locations={locations}
            selectedPlace={selectedPlace}
            showRoute={showRoute}
            setSelectedPlace={setSelectedPlace}
            setShowPlaceInfo={setShowPlaceInfo}
            setShowEmergencyModal={setShowEmergencyModal}
          />

          {/* Place Info Card */}
          <PlaceInfoCard
            place={selectedPlace}
            isVisible={showPlaceInfo && !!selectedPlace}
            onClose={closePlaceInfoCard}
            onRoutePress={startNavigationMode}
          />

          {/* Sidebar Overlay */}
          {isOpen && (
            <GestureDetector gesture={panGesture}>
              <Backdrop onClose={closeSidebar} />
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

      {/* Modals */}
      <EmergencyContactsModal
        visible={showEmergencyModal}
        onClose={closeEmergencyModal}
      />
    </>
  );
}