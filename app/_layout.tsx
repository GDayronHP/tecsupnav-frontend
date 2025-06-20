import { useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

import '../styles/global.css';

function RootLayout() {
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;
      if (typeof token === 'string') {
        SecureStore.setItemAsync('token', token);
        router.push('/home/index');
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    // Caso cuando la app se abre desde un deep link cold start
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
        initialRouteName="auth/index"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen
          name="auth/index"
          options={{
            headerShown: false,
            title: 'Inicio de sesión',
          }}
        />
        <Stack.Screen
          name="home/index"
          options={{ title: 'Página principal' }}
        />
      </Stack>
    </SafeAreaView>
  );
}

export default RootLayout;
