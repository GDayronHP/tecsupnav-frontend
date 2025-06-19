import { Text, View, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { router } from 'expo-router';

import logo from '../../assets/logo.png';
import googleIcon from '../../assets/google-icon.svg';

function Index() {
  return (
    <View className="flex-1 bg-neutral-25 px-6 pt-12">
      {/* Header con botón de regresar */}
      <View className="flex-row items-center mb-8">
        <Pressable className="p-2 border border-neutral-200 rounded-base">
          <Text className="text-primary-500 text-sm font-medium">← Volver al inicio</Text>
        </Pressable>
      </View>

      {/* Card principal */}
      <View className="bg-tecsup-card-bg rounded-card p-6 shadow-card">
        {/* Logo e icono */}
        <View className="items-center mb-6">
          <Image
            source={logo}
            contentFit="cover"
            transition={500}
            width={80}
            height={80}
          />
          <Text className="text-title text-tecsup-text-primary font-semibold">
            Acceder a TecsupNav
          </Text>
          <Text className="text-body text-tecsup-text-secondary mt-2 text-center">
            Inicia sesión con tu cuenta institucional
          </Text>
        </View>

        {/* Formulario */}
        <View className="space-y-4">
          {/* Input Email */}
          <View>
            <Text className="text-label text-tecsup-text-primary mb-2">
              Correo institucional
            </Text>
            <TextInput
              className="bg-tecsup-input-bg border border-neutral-200 rounded-input px-4 py-3 text-body text-tecsup-text-primary"
              placeholder="estudiante@tecsup.edu.pe"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Input Password */}
          <View>
            <Text className="text-label text-tecsup-text-primary mb-2">
              Contraseña
            </Text>
            <TextInput
              className="bg-tecsup-input-bg border border-neutral-200 rounded-input px-4 py-3 text-body text-tecsup-text-primary"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
          </View>

          {/* Botón Iniciar Sesión */}
          <Pressable style={{ borderRadius: 8, marginTop: 24, overflow: 'hidden' }} onPress={() => {router.push('/home')}}>
            <LinearGradient
              colors={['#00bcd4', '#00a4b8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4"
            >
              <Text className=" text-white text-label font-semibold text-center">
                Iniciar Sesión
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-neutral-200" />
          <Text className="px-4 text-caption text-tecsup-text-muted">o</Text>
          <View className="flex-1 h-px bg-neutral-200" />
        </View>

        {/* Google Button */}
        <Pressable className="flex-row items-center w-full border border-neutral-200 rounded-button py-3 px-4">
          <View className="pr-3">
            <Image
              source={googleIcon}
              contentFit="cover"
              transition={500}
              width={20}
              height={20}
            />
          </View>
          <View className="flex-1">
            <Text className="text-center text-label text-tecsup-text-primary">Acceder con Google</Text>
          </View>
        </Pressable>


        {/* Info de seguridad */}
        <View className="bg-info-50 rounded-base p-4 mt-6">
          <View className="flex-row">
            <View className="w-2 h-2 bg-info-500 rounded-full mt-2 mr-3" />
            <View className="flex-1">
              <Text className="text-label text-tecsup-text-primary font-medium mb-1">
                Acceso Seguro
              </Text>
              <Text className="text-caption text-tecsup-text-secondary">
                Tu información está protegida con autenticación institucional y cifrado de extremo a extremo.
              </Text>
            </View>
          </View>
        </View>

        {/* Enlaces de ayuda */}
        <View className="items-center mt-6 space-y-2">
          <Pressable>
            <Text className="text-tecsup-text-link text-caption">
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>
          <Pressable>
            <Text className="text-tecsup-text-link text-caption">
              Problemas para acceder
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default Index
