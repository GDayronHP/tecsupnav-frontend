import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
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
import Sidebar from "../components/AsideSection";
import ChatBot from "../components/ChatBot";
import EmergencyContactsModal from "../components/EmergencyContactsModal";
import { Image } from "expo-image";

const SIDEBAR_WIDTH = 320;

export default function MainScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

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

  const openChatBot = () => {
    setIsChatBotVisible(true);
  };

  const closeChatBot = () => {
    setIsChatBotVisible(false);
  };

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

  return (
    <>
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-tecsup-surface">
          <GestureDetector gesture={edgeGesture}>
            <Animated.View className="absolute left-0 top-0 bottom-0 w-5 z-30" />
          </GestureDetector>

          {/* Search Header */}
          <View className="flex-row items-center px-4 py-3 gap-2">
            <TouchableOpacity
              className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md"
              onPress={openSidebar}
            >
              <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>

            <View className="flex-1 h-11 bg-white rounded-full px-4 justify-center shadow-md">
              <TextInput
                className="text-base text-neutral-800"
                placeholder="Buscar aquí"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              className="w-11 h-11 rounded-full bg-white justify-center items-center relative shadow-md"
              onPress={openChatBot}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#333" />
              <View className="w-2 h-2 rounded-full bg-error-500 absolute top-2 right-2" />
            </TouchableOpacity>
          </View>

          {/* Campus information */}
          <View className="mx-4 my-2 bg-white rounded-2xl p-4 shadow-md">
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
                  5 ubicaciones disponibles
                </Text>
              </View>
            </View>

            <View className="border-t border-neutral-200 pt-4">
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
            <View className="flex-1 bg-neutral-200 justify-center items-center rounded-2xl">
              <Text className="text-lg font-semibold text-neutral-500 mb-2">
                Mapa del Campus
              </Text>
              <Text className="text-sm text-neutral-400">
                Vista satelital del campus universitario
              </Text>
            </View>

            {/* Your location */}
            <View className="absolute bottom-20 left-1/2 -ml-[6px] items-center">
              <View className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
              <View className="bg-white px-2 py-1 rounded-md mt-2 shadow-md">
                <Text className="text-xs text-neutral-800 font-medium">
                  Tu ubicación
                </Text>
              </View>
            </View>

            {/* Flash button */}
            <View className="absolute right-4 top-4">
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

            {/* Compass */}
            <View className="absolute right-4 bottom-4 items-center">
              <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center mb-1 shadow-md">
                <Ionicons name="compass-outline" size={24} color="#666" />
              </TouchableOpacity>
              <Text className="text-xs text-neutral-500 font-medium">
                Norte
              </Text>
            </View>

            {/* Navigation */}
            <View className="absolute right-4 bottom-24">
              <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md">
                <Ionicons name="navigate" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

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

          {/* Sidebar con gesto */}
          {isOpen && (
            <GestureDetector gesture={panGesture}>
              <Animated.View
                className="absolute left-0 top-0 bottom-0 bg-white z-50 shadow-2xl"
                style={[{ width: SIDEBAR_WIDTH }, sidebarAnimatedStyle]}
              >
                <Sidebar closeSidebar={closeSidebar} />
              </Animated.View>
            </GestureDetector>
          )}
        </View>
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