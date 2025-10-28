import { View, Text, TouchableOpacity, Image } from 'react-native'
import Switch from '@components/Switch';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AnimatedButton from '@components/AnimatedButton';

import { useUser } from '@context/UserContext';

interface SettingsModalBodyProps {
  settings: {
    notifications: boolean;
    location: boolean;
    darkMode: boolean;
    performanceMode: boolean;
  },
  updateSetting: (key: keyof SettingsModalBodyProps['settings'], value: boolean) => void,
  onClose: () => void,
  handleLogout?: () => void,
}

export default function SettingsModalBody({ settings, updateSetting, onClose, handleLogout }: SettingsModalBodyProps) {

  const { userData } = useUser();

  return (
    <View className="px-4 pb-6">
      <View className="mb-6">
        <Text className="text-sm font-medium text-neutral-600 my-3">Perfil</Text>
        <View className="bg-primary-50 rounded-xl p-4 flex-row items-center justify-between h-fit">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 bg-primary-500 rounded-full justify-center items-center">
              {userData?.avatar ? (
                <>
                  <Image
                    source={{ uri: userData.avatar }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                </>
              ) : (
                <Ionicons name="person" size={40} color="white" />
              )}
            </View>
            <View>
              <Text className="text-sm font-semibold text-neutral-900">Estudiante Tecsup</Text>
              <Text className="text-xs text-neutral-500">{userData.nombreCompleto}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push('/profile');
            }}
            className="rounded-lg bg-primary-100 py-2 px-4"
          >
            <Text className="text-primary-500 text-sm font-medium text-center">Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-neutral-600 mb-3">Preferencias</Text>

        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
            <Text className="text-sm text-neutral-700">Notificaciones</Text>
          </View>
          <Switch
            isOn={settings.notifications}
            onToggle={() => updateSetting('notifications', !settings.notifications)}
          />
        </View>

        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
            <Text className="text-sm text-neutral-700">Ubicación en tiempo real</Text>
          </View>

          <Switch
            isOn={settings.location}
            onToggle={() => updateSetting('location', !settings.location)}
          />
        </View>
      </View>

      <AnimatedButton
        onPress={handleLogout}
        className="w-full bg-error-500 py-3 px-4 rounded-xl flex-row items-center justify-center gap-2"
      >
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text className="text-white font-medium">Cerrar sesión</Text>
      </AnimatedButton>
    </View>
  )
}