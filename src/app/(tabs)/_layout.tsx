import { Tabs } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Components
import SettingsModal from "@features/settings/components/SettingsModal";
import VoiceConfirmationModal from "@features/home/components/VoiceConfirmationModal";
import ChatBot from "@features/home/components/ChatBot";

// Hooks
import useTabLayout from "@app/hooks/useTabLayout";

export default function TabLayout() {
  const {
    mainTabsRef,
    tabWidth,
    setTabWidth,
    showSettingsModal,
    setShowSettingsModal,
    showVoiceModal,
    setShowVoiceModal,
    showChatBot,
    setShowChatBot,
    transcription,
    isListening,
    error,
    startListening,
    aiResponse,
    handleVoiceRetry,
    pendingChatQuery,
    setPendingChatQuery,
    handleVoiceCancel,
    handleVoiceConfirm,
    handleVoiceAiResponse,
    closeChatBot,
    navigate
  } = useTabLayout();
  return (
    <>
      <View style={{ flex: 1 }} onLayout={(e) => setTabWidth(e.nativeEvent.layout.width)}>
        <Tabs
          ref={mainTabsRef}
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#00bcd4",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              paddingBottom: 8,
              height: 60,
              zIndex: 100
            },
          }}>
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

        <TouchableOpacity
          onPress={async () => {
            setShowVoiceModal(true);
            await startListening();
          }}
          style={{
            position: 'absolute',
            bottom: 5,
            left: tabWidth / 2 - 32,
            width: 65,
            height: 65,
            backgroundColor: "#00bcd4",
            borderRadius: 35,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 1000,
          }}
        >
          <Ionicons name="mic" size={36} color="white" />
        </TouchableOpacity>
      </View>

      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <VoiceConfirmationModal
        visible={showVoiceModal}
        transcription={transcription}
        isListening={isListening}
        error={error}
        startListening={handleVoiceRetry}
        onCancel={handleVoiceCancel}
        onConfirm={handleVoiceConfirm}
        onAiResponse={handleVoiceAiResponse}
        aiResponse={aiResponse}
      />

      {/* ChatBot Modal */}
      <ChatBot
        isVisible={showChatBot}
        initialQuery={pendingChatQuery}
        onClose={closeChatBot}
        onNavigate={navigate}
      />
    </>
  );
}