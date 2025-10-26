
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import '../../styles/global.css';
import { PlacesContextProvider } from "../shared/context/PlacesContext";
import { AppSettingsProvider } from "../shared/context/AppSettingsContext";
import { ChatbotContextProvider } from "@context/ChatbotContext";

function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppSettingsProvider>
        <PlacesContextProvider>
          <ChatbotContextProvider>
            <Stack screenOptions={
              {
                headerShown: false
              }
            } />
          </ChatbotContextProvider>
        </PlacesContextProvider>
      </AppSettingsProvider>
    </SafeAreaView>
  );
}

export default RootLayout;