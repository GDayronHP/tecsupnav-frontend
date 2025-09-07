import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const emergencyContacts = [
  {
    id: 1,
    name: "Seguridad Campus",
    phone: "(01) 630-6600 Ext.101",
  },
  {
    id: 2,
    name: "Seguridad Campus",
    phone: "(01) 630-6600 Ext.101",
  },
  {
    id: 3,
    name: "Seguridad Campus",
    phone: "(01) 630-6600 Ext.101",
  },
  {
    id: 4,
    name: "Seguridad Campus",
    phone: "(01) 630-6600 Ext.101",
  },
];

const EmergencyContactsModal = ({ visible, onClose }) => {
  const makeCall = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
    const phoneUrl = `tel:${cleanPhone}`;

    Alert.alert("Realizar llamada", `¿Deseas llamar a ${phoneNumber}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Llamar",
        onPress: () => {
          Linking.openURL(phoneUrl).catch((err) => {
            Alert.alert("Error", "No se pudo realizar la llamada");
            console.error("Error making call:", err);
          });
        },
      },
    ]);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
      style={{ zIndex: 9999 }}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />

      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              maxWidth: 400,
              alignSelf: "center",
              width: "100%",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e7eb",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="warning" size={20} color="#dc2626" />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#dc2626",
                  }}
                >
                  Contactos de Emergencia
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              {emergencyContacts.map((contact, index) => (
                <View
                  key={contact.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 16,
                    borderBottomWidth:
                      index !== emergencyContacts.length - 1 ? 1 : 0,
                    borderBottomColor: "#f3f4f6",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: 4,
                      }}
                    >
                      {contact.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6b7280",
                      }}
                    >
                      {contact.phone}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => makeCall(contact.phone)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 188, 212, 0.1)",
                      borderWidth: 1,
                      borderColor: "rgba(0, 188, 212, 0.2)",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      marginLeft: 12,
                    }}
                  >
                    <Ionicons
                      name="call"
                      size={16}
                      color="#00bcd4"
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        color: "#00bcd4",
                        fontWeight: "500",
                        fontSize: 14,
                      }}
                    >
                      Llamar
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default EmergencyContactsModal;
