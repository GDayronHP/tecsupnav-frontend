import React, { useState } from "react";

import { View } from "react-native";

import PermissionModal from "../components/PermissionModal";
import HomeScreen from "./HomeScreen";
import Loading from "@components/Loading";

export default function HomeContainer() {
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
    return <Loading title='Localizando en Tecsup' description='Conectando con el sistema del campus' iconName="navigate" />;
  }

  if (showMainScreen) {
    return (
      <>
        <HomeScreen />
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

