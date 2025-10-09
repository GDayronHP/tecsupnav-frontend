import { View, Text } from 'react-native'

import AnimatedButton from '@components/AnimatedButton'
import { Ionicons } from '@expo/vector-icons';

export default function AccountActionsContainer() {
    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
                <Ionicons name="person-circle-outline" size={20} color="#6B7280" />
                <Text className="text-lg font-semibold text-neutral-900 ml-2">
                    Cuenta
                </Text>
            </View>

            <View className="space-y-1">
                <AnimatedButton
                    className="flex-row items-center justify-between py-3"
                    onPress={() => console.log('Abrir ayuda y soporte')}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="help-circle-outline" size={18} color="#6B7280" />
                        <Text className="text-base text-neutral-700 ml-3">
                            Ayuda y soporte
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </AnimatedButton>

                <View className="border-b border-neutral-100" />

                <AnimatedButton
                    className="flex-row items-center justify-between py-3"
                    onPress={() => console.log('Ver términos y condiciones')}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="document-text-outline" size={18} color="#6B7280" />
                        <Text className="text-base text-neutral-700 ml-3">
                            Términos y condiciones
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </AnimatedButton>

                <View className="border-b border-neutral-100" />

                <AnimatedButton
                    className="flex-row items-center justify-between py-3"
                    onPress={() => console.log('Ver política de privacidad')}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="shield-checkmark-outline" size={18} color="#6B7280" />
                        <Text className="text-base text-neutral-700 ml-3">
                            Política de privacidad
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </AnimatedButton>

                <View className="border-b border-neutral-100" />

                <AnimatedButton
                    className="flex-row items-center justify-between py-3"
                    onPress={() => console.log('Cerrar sesión')}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                        <Text className="text-base text-red-500 ml-3">
                            Cerrar sesión
                        </Text>
                    </View>
                </AnimatedButton>
            </View>
        </View>
    )
}