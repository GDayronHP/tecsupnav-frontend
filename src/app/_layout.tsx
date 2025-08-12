
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import '../../styles/global.css';

function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={
        {
          headerShown: false
        }
      } />
    </SafeAreaView>
  );
}

export default RootLayout;