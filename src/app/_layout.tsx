
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import '../../styles/global.css';
import { PlacesContextProvider } from "../shared/context/PlacesContext";
import { AppSettingsProvider } from "../shared/context/AppSettingsContext";

function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppSettingsProvider>
        <PlacesContextProvider>
          <Stack screenOptions={
            {
              headerShown: false
            }
          } />
        </PlacesContextProvider>
      </AppSettingsProvider>
    </SafeAreaView>
  );
}

export default RootLayout;