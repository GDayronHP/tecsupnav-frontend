import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Place } from "@types/place";

export default function PlacesContainer({ filteredLocations = [] } : { filteredLocations: Place[] }) {

    useEffect(() => {
        console.log("Filtered Locations updated:", filteredLocations);
    }, [filteredLocations]);


    // It has to be changed with a new property in the API
    const getBadgeClasses = (category) => {
        const styles = {
            laboratorio: 'bg-badge-laboratorio-bg text-badge-laboratorio-text',
            biblioteca: 'bg-badge-servicio-bg text-badge-servicio-text',
            aula: 'bg-badge-activo-bg text-badge-activo-text',
            pabellon: 'bg-badge-nuevo-bg text-badge-nuevo-text',
            cafetería: 'bg-badge-cafeteria-bg text-badge-cafeteria-text',
            oficina: 'bg-badge-oficina-bg text-badge-oficina-text',
            default: 'bg-nuevo-bg text-badge-nuevo-text',
        };
        return styles[category] || styles.default;
    };

    return <>
        {
            filteredLocations.map((location, index) => (
                <View key={location.id} className="mb-4">
                    {/* Location Info */}
                    <View className="mb-2">
                        <Text className="text-subtitle text-tecsup-text-primary font-medium mb-1">
                            {location.nombre}
                        </Text>
                        <View className="flex-row items-center">
                            <View
                                className={`px-2 py-1 rounded-base mr-2 ${getBadgeClasses((location.tipo.nombre).toLowerCase())}`}
                            >
                                <Text className="text-xs font-medium">{location.tipo.nombre}</Text>
                            </View>
                            <Text className="text-tecsup-text-muted text-caption">
                                • Piso {location.piso}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                        <TouchableOpacity className="flex-1 bg-tecsup-surface py-3 rounded-button flex-row items-center justify-center">
                            <Ionicons name="eye" size={16} color="#0ea5e9" />
                            <Text className="text-tecsup-text-link text-label ml-2">Ver</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 bg-tecsup-cyan py-3 rounded-button flex-row items-center justify-center">
                            <Ionicons name="navigate" size={16} color="white" />
                            <Text className="text-white text-label ml-2">Ruta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    {index !== filteredLocations.length - 1 && (
                        <View className="border-b border-neutral-100 mt-3" />
                    )}
                </View>
            ))
        }
    </>
}

const styles = StyleSheet.create({});
