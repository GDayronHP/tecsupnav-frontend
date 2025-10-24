import { Text, View, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";

import logo from "@assets/icons/logo.png";
import googleIcon from "@assets/icons/google-icon.png";

import useAuth from "../hooks/useAuth";

import { LinearGradient } from "expo-linear-gradient";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {

  const { isLoading, isAuthenticated, isInitializing, handleLoginPress, request } = useAuth();

  // Mientras se verifica la autenticación inicial, mostrar splash
  if (isInitializing) {
    return (
      <LinearGradient
        colors={["#e6f9ff", "#e6f9ff", "white", "white", "#b3f0ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 w-full rounded-card shadow-card"
      >
        <View className="flex-1 px-6 items-center justify-center">
          <View className="bg-tecsup-card-bg rounded-card p-6 shadow-xl shadow-black/50">
            <View className="items-center">
              <Image source={logo} contentFit="cover" style={{ width: 52, height: 52 }} />
              <Text className="text-title text-tecsup-text-primary font-semibold mt-4">
                Verificando sesión...
              </Text>
              <Text className="text-body text-tecsup-text-secondary mt-2 text-center">
                Comprobando si ya tienes una sesión activa
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // Si ya está autenticado, mostrar estado de carga mientras navega
  if (isAuthenticated) {
    return (
      <LinearGradient
        colors={["#e6f9ff", "#e6f9ff", "white", "white", "#b3f0ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 w-full rounded-card shadow-card"
      >
        <View className="flex-1 px-6 items-center justify-center">
          <View className="bg-tecsup-card-bg rounded-card p-6 shadow-xl shadow-black/50">
            <View className="items-center">
              <Image source={logo} contentFit="cover" style={{ width: 52, height: 52 }} />
              <Text className="text-title text-tecsup-text-primary font-semibold mt-4">
                Redirigiendo...
              </Text>
              <Text className="text-body text-tecsup-text-secondary mt-2 text-center">
                Ya tienes una sesión activa
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
  
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
              <Image source={logo} contentFit="cover" style={{ width: 52, height: 52 }} />
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
          {isLoading && !isAuthenticated && (
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