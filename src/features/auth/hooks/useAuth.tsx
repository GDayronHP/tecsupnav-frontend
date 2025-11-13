import { useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-auth-session/providers/google";

import Constants from 'expo-constants';
const ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.androidClientId;


import { useRouter } from 'expo-router';
import { Alert } from "react-native";

export default function useAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

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
            const response = await authService.login({
                googleToken,
                email: userInfo.email,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                avatar: userInfo.picture,
            });

            const result = response.data;

            console.log('✅ Autenticación backend exitosa:', result);
            return result;
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

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Iniciando logout...');
            
            await authService.logout();

            setIsAuthenticated(false);    

            router.replace('/auth');
            
            console.log('✅ Logout completado exitosamente');
        } catch (error) {
            console.error('❌ Error durante logout:', error);

            try {
                await authService.clearAllTokens();
                setIsAuthenticated(false);
                router.replace('/auth');
            } catch (clearError) {
                console.error('❌ Error crítico limpiando tokens:', clearError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const checkExistingAuth = useCallback(async () => {
        try {
            setIsLoading(true);
            
            const existingToken = await SecureStore.getItemAsync('access_token');
            
            if (existingToken) {
                console.log('✅ Token existente encontrado, verificando validez...');
                
                const { isValid, user } = await authService.validateToken();
                
                if (isValid) {
                    console.log('✅ Token válido, redirigiendo a home...');
                    setIsAuthenticated(true);
                    router.replace('/(tabs)/home');
                    return;
                } else {
                    console.log('❌ Token inválido, limpiando...');
                    await authService.clearAllTokens();
                    setIsAuthenticated(false);
                }
            }
            
            console.log('ℹ️ No hay token válido, mostrando login...');
            setIsAuthenticated(false);
            
        } catch (error) {
            Alert.alert(
                "Error",
                "Ocurrió un error al verificar la autenticación. Por favor, inicia sesión nuevamente."
            );
            console.error('❌ Error verificando autenticación:', error);
            setIsAuthenticated(false);

            try {
                await authService.clearAllTokens();
            } catch (clearError) {
                console.error('❌ Error limpiando tokens tras error:', clearError);
            }
        } finally {
            setIsLoading(false);
            setIsInitializing(false);
        }
    }, [router]);

    useEffect(() => {
        checkExistingAuth();
    }, [checkExistingAuth]);

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

                        setIsAuthenticated(true);
                        
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

    return {
        isLoading,
        isAuthenticated,
        isInitializing,
        handleLoginPress,
        request,
        checkExistingAuth,
        logout
    };
}

