import { View, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'

// Components
import Map from './Map';

// Icons
import { Ionicons } from '@expo/vector-icons';

interface MapContainerProps {
    locations: any[];
    selectedPlace: any;
    showRoute: boolean;
    setSelectedPlace: React.Dispatch<React.SetStateAction<any>>;
    setShowPlaceInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setShowEmergencyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapContainer = memo(({
    locations,
    selectedPlace,
    showRoute,
    setSelectedPlace,
    setShowPlaceInfo,
    setShowEmergencyModal
}: MapContainerProps) => {
    return (
        <View className="flex-1 mx-4 mb-5 rounded-2xl overflow-hidden relative">
            <Map
                locations={locations}
                selectedPlace={selectedPlace}
                showRoute={showRoute}
                onMarkerPress={(place) => {
                    setSelectedPlace(place);
                    setShowPlaceInfo(true);
                }}
            />

            {/* Emergency Button */}
            <View className="absolute right-4 bottom-4">
                <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-error-500 justify-center items-center shadow-lg"
                    onPress={() => setShowEmergencyModal(true)}
                    activeOpacity={0.7}
                    style={{ zIndex: 1000 }}
                >
                    <Ionicons name="flash" size={22} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    )
});

export default MapContainer;