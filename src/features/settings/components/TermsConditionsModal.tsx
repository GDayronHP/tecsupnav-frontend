import { View, Text, ScrollView, Modal, SafeAreaView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Section from './Section'
import Paragraph from './Paragraph'
import BulletPoint from './BulletPoint'

interface TermsConditionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsConditionsModal({ visible, onClose }: TermsConditionsModalProps) {
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
            Términos y Condiciones
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
          <View className="bg-primary-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text" size={20} color="#059669" />
              <Text className="text-base font-semibold text-primary-800 ml-2">
                TecsupNav - Términos de Uso
              </Text>
            </View>
            <Text className="text-sm text-primary-700">
              Última actualización: Octubre 2025
            </Text>
            <Text className="text-sm text-primary-700 mt-2">
              Al usar TecsupNav, aceptas estos términos y condiciones.
            </Text>
          </View>

          <Section title="1. Descripción del Servicio">
            <Paragraph>
              TecsupNav es una aplicación móvil de georeferencia desarrollada para 
              la comunidad educativa de Tecsup. Su propósito es ayudar a estudiantes, 
              docentes y personal a navegar eficientemente por las instalaciones del campus.
            </Paragraph>
            <Paragraph>
              La aplicación proporciona:
            </Paragraph>
            <BulletPoint>Mapas interactivos del campus</BulletPoint>
            <BulletPoint>Navegación GPS en tiempo real</BulletPoint>
            <BulletPoint>Información sobre aulas, laboratorios y servicios</BulletPoint>
            <BulletPoint>Asistente virtual para consultas</BulletPoint>
          </Section>

          <Section title="2. Elegibilidad y Registro">
            <Paragraph>
              El uso de TecsupNav está destinado exclusivamente a:
            </Paragraph>
            <BulletPoint>Estudiantes matriculados en Tecsup</BulletPoint>
            <BulletPoint>Personal docente y administrativo de Tecsup</BulletPoint>
            <BulletPoint>Visitantes autorizados del campus</BulletPoint>
            <Paragraph>
              Es necesario proporcionar información veraz y actualizada durante el registro.
            </Paragraph>
          </Section>

          <Section title="3. Uso de Geolocalización">
            <Paragraph>
              TecsupNav requiere acceso a tu ubicación para funcionar correctamente:
            </Paragraph>
            <BulletPoint>Solo se accede a ubicación dentro del campus de Tecsup</BulletPoint>
            <BulletPoint>Los datos de ubicación no se almacenan permanentemente</BulletPoint>
            <BulletPoint>Puedes desactivar la geolocalización, pero limitará la funcionalidad</BulletPoint>
            <BulletPoint>No compartimos tu ubicación con terceros</BulletPoint>
          </Section>

          <Section title="4. Conducta del Usuario">
            <Paragraph>
              Al usar TecsupNav, te comprometes a:
            </Paragraph>
            <BulletPoint>Usar la aplicación solo para fines educativos y de navegación</BulletPoint>
            <BulletPoint>No interferir con el funcionamiento de la aplicación</BulletPoint>
            <BulletPoint>Respetar la privacidad de otros usuarios</BulletPoint>
            <BulletPoint>Reportar problemas técnicos o de seguridad</BulletPoint>
            <BulletPoint>No usar la aplicación para actividades comerciales no autorizadas</BulletPoint>
          </Section>

          <Section title="5. Propiedad Intelectual">
            <Paragraph>
              Todos los derechos de propiedad intelectual de TecsupNav pertenecen a Tecsup:
            </Paragraph>
            <BulletPoint>Mapas, imágenes y contenido del campus</BulletPoint>
            <BulletPoint>Código fuente y diseño de la aplicación</BulletPoint>
            <BulletPoint>Marcas registradas y logotipos de Tecsup</BulletPoint>
            <Paragraph>
              Está prohibida la reproducción, distribución o modificación no autorizada.
            </Paragraph>
          </Section>

          <Section title="6. Limitaciones de Responsabilidad">
            <Paragraph>
              TecsupNav se proporciona "tal como está". Tecsup no garantiza:
            </Paragraph>
            <BulletPoint>Exactitud al 100% de la información de ubicación</BulletPoint>
            <BulletPoint>Disponibilidad continua del servicio</BulletPoint>
            <BulletPoint>Funcionamiento en todos los dispositivos</BulletPoint>
            <Paragraph>
              Los usuarios son responsables de verificar la información crítica 
              (horarios, ubicaciones importantes) a través de fuentes oficiales.
            </Paragraph>
          </Section>

          <Section title="7. Privacidad y Datos">
            <Paragraph>
              El manejo de tus datos personales se rige por nuestra Política de Privacidad. 
              Recopilamos únicamente la información necesaria para proporcionar el servicio.
            </Paragraph>
          </Section>

          <Section title="8. Modificaciones">
            <Paragraph>
              Tecsup se reserva el derecho de modificar estos términos en cualquier momento. 
              Los cambios importantes serán notificados a través de la aplicación.
            </Paragraph>
          </Section>

          <Section title="9. Terminación">
            <Paragraph>
              Tecsup puede suspender o terminar tu acceso a TecsupNav si:
            </Paragraph>
            <BulletPoint>Violas estos términos y condiciones</BulletPoint>
            <BulletPoint>Ya no formas parte de la comunidad Tecsup</BulletPoint>
            <BulletPoint>Se detecta uso indebido de la aplicación</BulletPoint>
          </Section>

          <Section title="10. Contacto">
            <Paragraph>
              Para consultas sobre estos términos, contacta a:
            </Paragraph>
            <View className="bg-neutral-50 rounded-lg p-3">
              <Text className="text-sm text-neutral-700">
                📧 tecsupnav@gmail.com
              </Text>
              <Text className="text-sm text-neutral-700">
                📞 +51 945 515 528
              </Text>
              <Text className="text-sm text-neutral-700">
                🏢 Tecsup - Campus Lima
              </Text>
            </View>
          </Section>

          {/* Footer */}
          <View className="border-t border-neutral-200 pt-4 mt-4">
            <Text className="text-xs text-neutral-500 text-center">
              © { new Date().getFullYear()} Tecsup. Todos los derechos reservados.
              {'\n'}
              TecsupNav v1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}