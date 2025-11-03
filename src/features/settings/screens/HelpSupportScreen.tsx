import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Linking, Alert, Image } from 'react-native'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useChatbot } from '@context/ChatbotContext'

import FAQItem from '../components/FAQItem'
import ContactOption from '../components/ContactOption'

const faqData = [
    {
        question: "¿Cómo uso la función de navegación en el campus?",
        answer: "Toca alguna ubicación en el mapa y presiona \"Iniciar\". La app te guiará desde tu ubicación actual hasta el destino seleccionado usando rutas peatonales optimizadas para el campus de Tecsup.",
        icon: "navigate-outline" as const
    },
    {
        question: "¿Por qué no puedo ver mi ubicación en el mapa?",
        answer: "Asegúrate de haber dado permisos de ubicación a la app. Ve a Configuración > Privacidad > Ubicación y activa los permisos para TecsupNav. También verifica que tu GPS esté activado.",
        icon: "location-outline" as const
    },
    {
        question: "¿Cómo busco un lugar específico en el campus?",
        answer: "Usa la barra de búsqueda en la parte superior o abre el menú lateral para filtrar por categorías como aulas, laboratorios, cafetería, biblioteca, etc.",
        icon: "search-outline" as const
    },
    {
        question: "¿La app funciona sin conexión a internet?",
        answer: "El mapa del campus se descarga automáticamente y funciona sin internet. Solo necesitas conexión para actualizaciones de horarios y información de lugares.",
        icon: "wifi-outline" as const
    },
    {
        question: "¿Cómo reporto un lugar que no está en el mapa?",
        answer: "Contacta a soporte técnico. Nuestro equipo agregará nuevos lugares y actualizará la información regularmente.",
        icon: "add-circle-outline" as const
    }
];

export default function HelpSupportScreen() {

    const { openChatBot } = useChatbot();

    const handleContactEmail = () => {
        Linking.openURL('mailto:tecsupnav@gmail.com?subject=Soporte TecsupNav')
            .catch(() => {
                Alert.alert('Error', 'No se pudo abrir el cliente de correo. Por favor, contacta a tecsupnav@gmail.com')
            })
    }

    const handleContactPhone = () => {
        Alert.alert(
            'Contactar por teléfono',
            '¿Deseas llamar a soporte técnico?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Llamar',
                    onPress: () => Linking.openURL('tel:+51945515528')
                }
            ]
        )
    }

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Hola, necesito ayuda con la app TecsupNav')
        Linking.openURL(`whatsapp://send?phone=51945515528&text=${message}`)
            .catch(() => {
                Alert.alert('Error', 'WhatsApp no está instalado en tu dispositivo')
            })
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            <Stack.Screen
                options={{
                    title: "Ayuda y Soporte",
                    headerShown: true,
                    headerTitleStyle: { fontSize: 18, fontWeight: '600' },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="ml-2"
                        >
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView className="flex-1 px-4 py-4">
                {/* Header */}
                {/* <View className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-6">
          <View className="flex-row items-center mb-2">
            <Image 
              source={require('@assets/icons/logo.png')}
              className="w-10 h-10"
            />
            <Text className="text-xl font-bold text-black ml-3">
              TecsupNav
            </Text>
          </View>
          <Text className="text-neutral-900 text-sm leading-5">
            Tu guía inteligente para navegar por el campus de Tecsup. 
            Encuentra aulas, laboratorios, servicios y más con facilidad.
          </Text>
        </View> */}

                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-neutral-900 mb-3">
                        ¿Necesitas ayuda inmediata?
                    </Text>

                    <ContactOption
                        title="Chat con asistente virtual"
                        subtitle="Pregunta cualquier duda sobre el campus"
                        icon="chatbubble-ellipses-outline"
                        onPress={() => {
                            router.push('/home');
                            openChatBot();
                        }}
                    />
                </View>

                {/* Contact Options */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-neutral-900 mb-3">
                        Contactar soporte técnico
                    </Text>

                    <ContactOption
                        title="Correo electrónico"
                        subtitle="tecsupnav@gmail.com"
                        icon="mail-outline"
                        onPress={handleContactEmail}
                    />

                    <ContactOption
                        title="WhatsApp"
                        subtitle="Respuesta rápida por chat"
                        icon="logo-whatsapp"
                        onPress={handleWhatsApp}
                    />

                    <ContactOption
                        title="Teléfono"
                        subtitle="+51 945 515 528"
                        icon="call-outline"
                        onPress={handleContactPhone}
                    />
                </View>

                {/* FAQ Section */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-neutral-900 mb-3">
                        Preguntas frecuentes
                    </Text>

                    {faqData.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            icon={faq.icon}
                        />
                    ))}
                </View>

                {/* App Info */}
                <View className="bg-white rounded-xl p-4 mb-6">
                    <Text className="text-base font-semibold text-neutral-900 mb-3">
                        Información de la aplicación
                    </Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-neutral-600">Versión:</Text>
                            <Text className="text-sm text-neutral-900">1.0.0</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-neutral-600">Última actualización:</Text>
                            <Text className="text-sm text-neutral-900">Octubre 2025</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-neutral-600">Desarrollado por:</Text>
                            <Text className="text-sm text-neutral-900">Tecsup</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="items-center py-4">
                    <Text className="text-xs text-neutral-500 text-center">
                        Si tienes problemas técnicos, incluye detalles como tu dispositivo
                        y versión de sistema operativo al contactar soporte.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}