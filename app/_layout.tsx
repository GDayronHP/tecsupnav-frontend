import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"

import '../styles/global.css';

function RootLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack
                initialRouteName="auth/index" 
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                }}
            >
                <Stack.Screen name="auth/index" options={
                    {
                        headerShown: false,
                        title: 'Inicio de sesión',
                    }
                } />
                <Stack.Screen name="home/index" options={
                    { title: 'Página principal' }
                } />
            </Stack>
        </SafeAreaView>
    )
}

export default RootLayout
