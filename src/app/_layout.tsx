
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import '../../styles/global.css';

import { VoiceRecognitionProvider } from "../shared/context/VoiceRecognitionContext";

function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VoiceRecognitionProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </VoiceRecognitionProvider>
    </SafeAreaView>
  );
}

export default RootLayout;