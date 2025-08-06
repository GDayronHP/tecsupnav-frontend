import { useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

import '../../styles/global.css';

function RootLayout() {
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;
      if (typeof token === 'string') {
        SecureStore.setItemAsync('token', token);
        router.push('home');
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        initialRouteName="auth"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
            title: 'Inicio de sesión',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

export default RootLayout;
