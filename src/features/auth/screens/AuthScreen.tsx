import { Text, View, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-auth-session/providers/google";

import logo from "@assets/icons/logo.png";
import googleIcon from "@assets/icons/google-icon.png";

import { LinearGradient } from "expo-linear-gradient";

import { useEffect, useState, useCallback } from "react";

import { useRouter } from 'expo-router';

import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;
const ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.androidClientId;


export default function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.webClientId,
  });

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Error obteniendo información del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo info del usuario:', error);
      throw error;
    }
  };

  const authenticateWithBackend = async (googleToken, userInfo) => {
    try {
      console.log('🚀 Enviando datos a backend...');
      console.log('User info:', userInfo);

      const response = await fetch(`${API_BASE_URL}/auth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: googleToken,
          email: userInfo.email,
          firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
          lastName: userInfo.family_name || userInfo.name?.split(' ').slice(1).join(' ') || '',
          avatar: userInfo.picture,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error en la autenticación');
      }

      console.log('✅ Autenticación backend exitosa:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error en autenticación backend:', error);
      throw error;
    }
  };

  const navigateToHome = useCallback(() => {
    try {
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  }, [router]);

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        setIsLoading(true);

        try {
          const { authentication } = response;

          if (authentication?.accessToken) {
            console.log('✅ Google access token recibido');

            const userInfo = await getUserInfo(authentication.accessToken);
            console.log('✅ Info del usuario obtenida:', userInfo);

            if (!userInfo.email?.endsWith('@tecsup.edu.pe')) {
              Alert.alert(
                'Error de acceso',
                'Solo se permiten correos institucionales (@tecsup.edu.pe)',
                [{ text: 'OK' }]
              );
              setIsLoading(false);
              return;
            }

            const backendResponse = await authenticateWithBackend(
              authentication.accessToken,
              userInfo
            );

            await SecureStore.setItemAsync('access_token', backendResponse.access_token);
            await SecureStore.setItemAsync('user_info', JSON.stringify(backendResponse.user));

            await SecureStore.setItemAsync('google_token', authentication.accessToken);

            console.log('✅ Datos guardados en SecureStore');
            console.log('🚀 Redirigiendo a home...');

            setTimeout(() => {
              navigateToHome();
            }, 100);

          } else {
            throw new Error('No se recibió access token de Google');
          }
        } catch (error) {
          console.error('❌ Error en proceso de autenticación:', error);

          let errorMessage = 'Error desconocido en la autenticación';

          if (error.message.includes('correos institucionales')) {
            errorMessage = 'Solo se permiten correos institucionales (@tecsup.edu.pe)';
          } else if (error.message.includes('Token de Google inválido')) {
            errorMessage = 'Token de Google inválido';
          } else if (error.message.includes('Error en la autenticación')) {
            errorMessage = 'Error en el servidor de autenticación';
          } else if (error.message.includes('Network')) {
            errorMessage = 'Error de conexión. Verifica tu internet';
          }

          Alert.alert('Error de autenticación', errorMessage);
          setIsLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('❌ Error en Google OAuth:', response.error);
        Alert.alert('Error', 'No se pudo completar la autenticación con Google');
        setIsLoading(false);
      } else if (response?.type === 'cancel') {
        console.log('🚫 Usuario canceló la autenticación');
        setIsLoading(false);
      }
    };

    if (response) {
      handleGoogleResponse();
    }
  }, [response, navigateToHome]);

  const handleLoginPress = useCallback(async () => {
    if (isLoading || !request) return;

    try {
      setIsLoading(true);
      console.log('🚀 Iniciando login con Google...');

      const result = await promptAsync();

      if (result.type === 'cancel') {
        setIsLoading(false);
      }

    } catch (error) {
      console.error("❌ Error durante login con Google:", error);
      Alert.alert("Error", "No se pudo iniciar sesión con Google");
      setIsLoading(false);
    }
  }, [isLoading, request, promptAsync]);

  return (
    <LinearGradient
      colors={["#e6f9ff", "#e6f9ff", "white", "white", "#b3f0ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 w-full rounded-card shadow-card"
    >
      <View className="flex-1 px-6 items-center justify-center">
        <View className="bg-tecsup-card-bg rounded-card p-6 shadow-xl shadow-black/50">
          <View className="items-center mb-8">
            <View className="mb-3">
              <Image source={logo} contentFit="cover" style={{ width: 24, height: 24 }} />
            </View>
            <Text className="text-title text-tecsup-text-primary font-semibold">
              Acceder a TecsupNav
            </Text>
            <Text className="text-body text-tecsup-text-secondary mt-2 text-center">
              Inicia sesión con tu cuenta de Google institucional
            </Text>
          </View>

          <Pressable
            className={`flex-row items-center w-full border border-neutral-200 rounded-button py-4 px-4 mb-6 ${isLoading || !request
                ? 'opacity-50'
                : ' active:bg-neutral-100'
              }`}
            disabled={isLoading || !request}
            onPress={handleLoginPress}
          >
            <View className="pr-3">
              <Image
                source={googleIcon}
                contentFit="cover"
                style={{ width: 24, height: 24 }}
              />
            </View>
            <View className="flex-1">
              <Text className="text-center text-label text-tecsup-text-primary font-medium">
                {isLoading ? 'Autenticando...' : 'Acceder con Google'}
              </Text>
            </View>
          </Pressable>

          <View className="bg-info-50 rounded-base p-4 mb-6">
            <View className="flex-row">
              <View className="w-2 h-2 bg-info-500 rounded-full mt-2 mr-3" />
              <View className="flex-1">
                <Text className="text-label text-tecsup-text-primary font-medium mb-1">
                  Acceso Seguro
                </Text>
                <Text className="text-caption text-tecsup-text-secondary">
                  Tu información está protegida con autenticación de Google y
                  cifrado de extremo a extremo.
                </Text>
              </View>
            </View>
          </View>

          {/* Indicador de carga */}
          {isLoading && (
            <View className="bg-blue-50 rounded-base p-4">
              <Text className="text-center text-caption text-blue-700">
                Procesando autenticación...
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}