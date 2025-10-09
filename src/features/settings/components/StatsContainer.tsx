import { View, Text } from 'react-native'
import AnimatedButton from '@components/AnimatedButton'

const userStats = {
    ubicacionesVisitadas: 23,
    navegaciones: 15,
    diasActivo: 7
};


export default function StatsContainer() {

    return (
        <View className="flex-row justify-around mt-6 pt-6 border-t border-neutral-100">
            <AnimatedButton
                className="items-center"
                onPress={() => console.log('Ver ubicaciones visitadas')}
            >
                <Text className="text-3xl font-bold text-primary-500 mb-1">
                    {userStats.ubicacionesVisitadas}
                </Text>
                <Text className="text-sm text-neutral-600 text-center">
                    Ubicaciones{'\n'}visitadas
                </Text>
            </AnimatedButton>

            <AnimatedButton
                className="items-center"
                onPress={() => console.log('Ver historial de navegaciones')}
            >
                <Text className="text-3xl font-bold text-success-500 mb-1">
                    {userStats.navegaciones}
                </Text>
                <Text className="text-sm text-neutral-600 text-center">
                    Navega{'\n'}ciones
                </Text>
            </AnimatedButton>

            <AnimatedButton
                className="items-center"
                onPress={() => console.log('Ver actividad diaria')}
            >
                <Text className="text-3xl font-bold text-warning-500 mb-1">
                    {userStats.diasActivo}
                </Text>
                <Text className="text-sm text-neutral-600 text-center">
                    Días{'\n'}activo
                </Text>
            </AnimatedButton>
        </View>
    )
}