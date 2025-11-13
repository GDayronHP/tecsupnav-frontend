
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import '../../styles/global.css';

import { PlacesContextProvider } from "../shared/context/PlacesContext";
import { AppSettingsProvider } from "../shared/context/AppSettingsContext";
import { ChatbotContextProvider } from "@context/ChatbotContext";
import { VoiceRecognitionProvider } from "../shared/context/VoiceRecognitionContext";


function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppSettingsProvider>
        <PlacesContextProvider>
          <VoiceRecognitionProvider>
            <ChatbotContextProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </ChatbotContextProvider>
          </VoiceRecognitionProvider>
        </PlacesContextProvider>
      </AppSettingsProvider>
    </SafeAreaView>
  );
}

export default RootLayout;