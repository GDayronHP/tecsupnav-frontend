
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import '../../styles/global.css';
import { PlacesContextProvider } from "../shared/context/PlacesContext";

function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PlacesContextProvider>
        <Stack screenOptions={
          {
            headerShown: false
          }
        } />
      </PlacesContextProvider>
    </SafeAreaView>
  );
}

export default RootLayout;