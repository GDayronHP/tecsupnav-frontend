import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00bcd4",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60
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
        }}
      />
    </Tabs>
  );
}
