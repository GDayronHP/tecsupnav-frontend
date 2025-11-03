import { View, Text, ScrollView, Modal, SafeAreaView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Section from './Section'
import Paragraph from './Paragraph'
import BulletPoint from './BulletPoint'
import InfoBox from './InfoBox';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
          <Text className="text-lg font-semibold text-neutral-900">
            Política de Privacidad
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-neutral-100"
          >
            <Ionicons name="close" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Introduction */}
          <View className="bg-green-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark" size={20} color="#059669" />
              <Text className="text-base font-semibold text-green-800 ml-2">
                Tu privacidad es importante
              </Text>
            </View>
            <Text className="text-sm text-green-700">
              Última actualización: Octubre 2025
            </Text>
            <Text className="text-sm text-green-700 mt-2">
              Esta política explica cómo TecsupNav maneja tu información personal.
            </Text>
          </View>

          <Section title="1. Información que Recopilamos">
            <Paragraph>
              TecsupNav recopila únicamente la información esencial para proporcionar 
              servicios de navegación en el campus:
            </Paragraph>
            
            <Text className="text-base font-semibold text-neutral-800 mb-2">
              Información de Registro:
            </Text>
            <BulletPoint>Nombre completo y código de estudiante/empleado</BulletPoint>
            <BulletPoint>Correo electrónico institucional (@tecsup.edu.pe)</BulletPoint>
            <BulletPoint>Tipo de usuario (estudiante, docente, administrativo)</BulletPoint>
            
            <Text className="text-base font-semibold text-neutral-800 mb-2 mt-4">
              Datos de Ubicación:
            </Text>
            <BulletPoint>Ubicación GPS actual (solo dentro del campus)</BulletPoint>
            <BulletPoint>Historial de navegación entre ubicaciones del campus</BulletPoint>
            <BulletPoint>Preferencias de rutas y lugares favoritos</BulletPoint>
            
            <Text className="text-base font-semibold text-neutral-800 mb-2 mt-4">
              Información de Uso:
            </Text>
            <BulletPoint>Lugares más visitados y búsquedas frecuentes</BulletPoint>
            <BulletPoint>Interacciones con el asistente virtual</BulletPoint>
            <BulletPoint>Reportes de problemas y comentarios</BulletPoint>
          </Section>

          <Section title="2. Cómo Usamos tu Información">
            <Paragraph>
              Utilizamos tu información exclusivamente para:
            </Paragraph>
            <BulletPoint>Proporcionar navegación personalizada en el campus</BulletPoint>
            <BulletPoint>Mejorar la precisión de las rutas y ubicaciones</BulletPoint>
            <BulletPoint>Ofrecer recomendaciones de lugares relevantes</BulletPoint>
            <BulletPoint>Brindar soporte técnico y resolver problemas</BulletPoint>
            <BulletPoint>Generar estadísticas anónimas de uso del campus</BulletPoint>
            
            <InfoBox title="Compromiso de Privacidad">
              NUNCA usamos tu información para publicidad, marketing externo o 
              la compartimos con empresas comerciales.
            </InfoBox>
          </Section>

          <Section title="3. Manejo de Datos de Ubicación">
            <Paragraph>
              Tu ubicación es especialmente importante para nosotros:
            </Paragraph>
            
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <Text className="text-sm font-semibold text-yellow-800 mb-1">
                🔒 Protección de Ubicación
              </Text>
              <BulletPoint>Solo accedemos a ubicación cuando usas la app activamente</BulletPoint>
              <BulletPoint>Los datos de ubicación se procesan localmente en tu dispositivo</BulletPoint>
              <BulletPoint>No almacenamos tu ubicación histórica más de 30 días</BulletPoint>
              <BulletPoint>Puedes desactivar el acceso a ubicación en cualquier momento</BulletPoint>
            </View>
            
            <InfoBox title="Geofencing del Campus">
              La app solo funciona dentro de los límites del campus de Tecsup. 
              Fuera del campus, no recopilamos datos de ubicación.
            </InfoBox>
          </Section>

          <Section title="4. Compartir Información">
            <Paragraph>
              TecsupNav NO comparte tu información personal con terceros, excepto:
            </Paragraph>
            <BulletPoint>Personal autorizado de TI de Tecsup (solo para soporte técnico)</BulletPoint>
            <BulletPoint>Cuando lo requiera la ley o autoridades competentes</BulletPoint>
            <BulletPoint>En caso de emergencia para garantizar tu seguridad</BulletPoint>
            
            <InfoBox title="Datos Agregados">
              Podemos compartir estadísticas anónimas (ej: "las áreas más visitadas del campus") 
              para mejorar los servicios del campus, pero NUNCA información personal identificable.
            </InfoBox>
          </Section>

          <Section title="5. Seguridad de Datos">
            <Paragraph>
              Implementamos múltiples medidas de seguridad:
            </Paragraph>
            <BulletPoint>Encriptación de datos en tránsito y almacenamiento</BulletPoint>
            <BulletPoint>Autenticación segura con credenciales institucionales</BulletPoint>
            <BulletPoint>Acceso limitado solo a personal autorizado de Tecsup</BulletPoint>
            <BulletPoint>Monitoreo continuo de seguridad y actualizaciones regulares</BulletPoint>
            <BulletPoint>Respaldo seguro de datos en servidores de Tecsup</BulletPoint>
          </Section>

          <Section title="6. Tus Derechos">
            <Paragraph>
              Como usuario de TecsupNav, tienes derecho a:
            </Paragraph>
            <BulletPoint>Acceder a toda tu información personal almacenada</BulletPoint>
            <BulletPoint>Corregir datos incorrectos o desactualizados</BulletPoint>
            <BulletPoint>Solicitar la eliminación de tu cuenta y datos</BulletPoint>
            <BulletPoint>Desactivar funciones específicas (ubicación)</BulletPoint>
            <BulletPoint>Exportar tus datos en formato legible</BulletPoint>
            
            <View className="bg-neutral-50 rounded-lg p-3 mt-3">
              <Text className="text-sm text-neutral-700">
                Para ejercer estos derechos, contacta a: 
                <Text className="font-semibold"> tecsupnav@gmail.com</Text>
              </Text>
            </View>
          </Section>

          <Section title="7. Retención de Datos">
            <Paragraph>
              Conservamos tu información mientras:
            </Paragraph>
            <BulletPoint>Seas parte activa de la comunidad Tecsup</BulletPoint>
            <BulletPoint>Sea necesaria para proporcionar el servicio</BulletPoint>
            <BulletPoint>Lo requieran obligaciones legales o académicas</BulletPoint>
            
            <Paragraph>
              Cuando ya no necesitemos tu información, la eliminaremos de forma segura.
            </Paragraph>
          </Section>

          <Section title="8. Menores de Edad">
            <Paragraph>
              Si eres menor de 18 años, necesitas autorización de tus padres o tutores 
              para usar TecsupNav. Tecsup puede requerir verificación de esta autorización.
            </Paragraph>
          </Section>

          <Section title="9. Cambios en la Política">
            <Paragraph>
              Podemos actualizar esta política para reflejar cambios en nuestras prácticas 
              o por requerimientos legales. Te notificaremos sobre cambios importantes 
              a través de la aplicación o tu correo institucional.
            </Paragraph>
          </Section>

          <Section title="10. Contacto">
            <Paragraph>
              Para consultas sobre privacidad o esta política:
            </Paragraph>
            <View className="bg-neutral-50 rounded-lg p-4">
              <Text className="text-sm font-semibold text-neutral-800 mb-2">
                Oficial de Privacidad - TecsupNav
              </Text>
              <Text className="text-sm text-neutral-700">
                📧 tecsupnav@gmail.com
              </Text>
              <Text className="text-sm text-neutral-700">
                📞 +51 945 515 528
              </Text>
              <Text className="text-sm text-neutral-700">
                ⏰ Lunes a Viernes: 8:00 AM - 6:00 PM
              </Text>
            </View>
          </Section>

          {/* Footer */}
          <View className="border-t border-neutral-200 pt-4 mt-4">
            <Text className="text-xs text-neutral-500 text-center">
              © 2025 Tecsup. Comprometidos con tu privacidad.
              {'\n'}
              TecsupNav v1.0.0 - Política de Privacidad
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}