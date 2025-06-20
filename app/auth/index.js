import { Text, View, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

import logo from '../../assets/logo.png';
import googleIcon from '../../assets/google-icon.svg';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

function Index() {
  // Crea la URL de callback correcta
  const redirectUri = Linking.createURL('auth/callback');

  console.log('Redirect URI:', redirectUri); // Para debugging

  const handleLogin = async () => {
    try {
      // Construye la URL de autenticación con el redirect URI
      const authUrl = `https://horses-tip-rob-wishing.trycloudflare.com/auth/google?redirect=${encodeURIComponent(redirectUri)}`;

      console.log('Auth URL:', authUrl); // Para debugging

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      console.log('WebBrowser result:', result); // Para debugging

      if (result.type === 'success' && result.url) {
        await handleAuthResult(result.url);
      } else if (result.type === 'cancel') {
        console.log('Usuario canceló la autenticación');
      } else {
        console.log('Error en WebBrowser:', result);
        Alert.alert('Error', 'Inicio de sesión fallido');
      }
    } catch (error) {
      console.error('Error en handleLogin:', error);
      Alert.alert('Error', 'Ocurrió un error durante el inicio de sesión');
    }
  };

  const handleAuthResult = async (url) => {
    try {
      console.log('Processing auth result URL:', url);

      const parsedUrl = new URL(url);

      const error = parsedUrl.searchParams.get('error');
      const message = parsedUrl.searchParams.get('message');
      const token = parsedUrl.searchParams.get('token');
      const status = parsedUrl.searchParams.get('status');

      console.log('URL params:', { error, message, token, status });

      if (error) {
        const errorMessage = message ? decodeURIComponent(message) : 'Error desconocido';
        router.replace('/auth');
        Alert.alert('Error de inicio de sesión', errorMessage);
        return;
      }

      if (token) {
        console.log('Token recibido, guardando...');
        await SecureStore.setItemAsync('token', token);

        // Pequeño delay para asegurar que el token se guarde
        setTimeout(() => {
          router.replace('/home');
        }, 100);
      } else {
        console.error('No se recibió token ni error');
        Alert.alert('Error', 'No se pudo completar la autenticación');
      }
    } catch (error) {
      console.error('Error procesando resultado de auth:', error);
      Alert.alert('Error', 'Error procesando la respuesta de autenticación');
    }
  };

  useEffect(() => {
    let subscription;

    const setupDeepLinkListener = () => {
      subscription = Linking.addEventListener('url', (event) => {
        console.log('Deep link recibido:', event.url);

        // Verifica si es una URL de callback de auth
        if (event.url.includes('auth/callback')) {
          handleAuthResult(event.url);
        }
      });
    };

    setupDeepLinkListener();

    // Verifica si la app fue abierta con un deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        if (url.includes('auth/callback')) {
          handleAuthResult(url);
        }
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <LinearGradient
      colors={['#e6f9ff', '#e6f9ff', 'white', 'white', '#b3f0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 w-full rounded-card shadow-card"
    >
      <View className="flex-1 px-6 items-center justify-center">
        <View className="bg-tecsup-card-bg rounded-card p-6 shadow-xl shadow-black/50">

          <View className="items-center mb-8">
            <Image source={logo} contentFit="cover" width={80} height={80} />
            <Text className="text-title text-tecsup-text-primary font-semibold">Acceder a TecsupNav</Text>
            <Text className="text-body text-tecsup-text-secondary mt-2 text-center">
              Inicia sesión con tu cuenta de Google institucional
            </Text>
          </View>

          <Pressable
            className="flex-row items-center w-full border border-neutral-200 rounded-button active:scale-95 active:bg-neutral-100 py-4 px-4 mb-6"
            onPress={handleLogin}
          >
            <View className="pr-3">
              <Image source={googleIcon} contentFit="cover" width={24} height={24} />
            </View>
            <View className="flex-1">
              <Text className="text-center text-label text-tecsup-text-primary font-medium">
                Acceder con Google
              </Text>
            </View>
          </Pressable>

          {/* Info de seguridad */}
          <View className="bg-info-50 rounded-base p-4 mb-6">
            <View className="flex-row">
              <View className="w-2 h-2 bg-info-500 rounded-full mt-2 mr-3" />
              <View className="flex-1">
                <Text className="text-label text-tecsup-text-primary font-medium mb-1">
                  Acceso Seguro
                </Text>
                <Text className="text-caption text-tecsup-text-secondary">
                  Tu información está protegida con autenticación de Google y cifrado de extremo a extremo.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default Index;