import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function OAuthRedirectScreen() {
  const params = useLocalSearchParams();
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('🔄 OAuth redirect recibido:', params);
        
        if (params.code) {
          console.log('✅ Authorization code recibido:', params.code);
          router.replace('/auth');
        } else if (params.error) {
          console.error('❌ OAuth error:', params.error);
          router.replace('/auth');
        } else {
          console.log('ℹ️ No code or error, redirecting to auth');
          router.replace('/auth');
        }
      } catch (error) {
        console.error('❌ Error in OAuth redirect:', error);
        router.replace('/auth');
      }
    };
    
    const timer = setTimeout(handleOAuthCallback, 100);
    
    return () => clearTimeout(timer);
  }, [params]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f0f9ff'
    }}>
      <ActivityIndicator size="large" color="#00bcd4" />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: '#374151',
        fontWeight: '500'
      }}>
        Procesando autenticación...
      </Text>
      <Text style={{ 
        marginTop: 8, 
        fontSize: 14, 
        color: '#6b7280',
        textAlign: 'center',
        paddingHorizontal: 32
      }}>
        Conectando con el servidor de autenticación
      </Text>
    </View>
  );
}