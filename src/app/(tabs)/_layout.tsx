import React, { useState } from "react";
import { Tabs } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SettingsModal from "../../features/settings/components/SettingsModal";

export default function TabLayout() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#00bcd4",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            paddingBottom: 5,
            height: 50,
            zIndex:100
          },
        }}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="location" size={24} color={color} />
          ),
        }}
      />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Ajustes",
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings" size={24} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={() => setShowSettingsModal(true)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 5,
                }}
              >
                <Ionicons name="settings" size={24} color="gray" />
                <Text style={{ 
                  fontSize: 10, 
                  color: "gray",
                  marginTop: 2 
                }}>
                  Ajustes
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      <SettingsModal 
        visible={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}