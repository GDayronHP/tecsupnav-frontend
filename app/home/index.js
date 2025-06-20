import { Text, View, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

function Index() {
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cerrar sesión',
          onPress: async () => {
            await SecureStore.deleteItemAsync('token');
            router.replace('/auth');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 30 }}>
        🎉 Bienvenido a TecsupNav
      </Text>

      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: '#ef4444', // rojo
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}

export default Index;
