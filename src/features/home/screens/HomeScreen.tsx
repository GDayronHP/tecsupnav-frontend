import React, { useState } from "react";

import { View} from "react-native";

import PermissionModal from "../components/PermissionModal";
import LoadingScreen from "./LoadingScreen";
import MainScreen from "./MainScreen";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showMainScreen, setShowMainScreen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const permissionState = {
    setIsLoading,
    setShowMainScreen,
    showPermissionModal,
    setShowPermissionModal,
    dontAskAgain,
    setDontAskAgain,
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showMainScreen) {
    return (
      <>
        <MainScreen />
        <PermissionModal {...permissionState} />
      </>
    );
  }

  return (
    <View className="flex-1 bg-tecsup-surface">
      <PermissionModal {...permissionState} />
    </View>
  );
}

