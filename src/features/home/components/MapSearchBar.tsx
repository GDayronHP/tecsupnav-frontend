import React, { useState, useRef } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Text, 
  Animated, 
  Easing 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFilterData from "../hooks/useFilterData";
import { Place } from "@types/place";

interface MapSearchBarProps {
  locations: Place[];
  onSelect: (place: Place) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ locations, onSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  const filteredLocations = useFilterData(locations, searchText);

  const showDropdownWithAnimation = () => {
    setShowDropdown(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideDropdownWithAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDropdown(false);
    });
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (text.length > 0 && !showDropdown) {
      showDropdownWithAnimation();
    } else if (text.length === 0 && showDropdown) {
      hideDropdownWithAnimation();
    }
  };

  const handleFocus = () => {
    if (searchText.length > 0 && !showDropdown) {
      showDropdownWithAnimation();
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    if (showDropdown) {
      hideDropdownWithAnimation();
    }
  };

  const handleSelectItem = (item: Place) => {
    onSelect(item);
    setSearchText(item.nombre);
    hideDropdownWithAnimation();
  };

  return (
    <View className="flex-1 rounded-full bg-white justify-center items-center relative">
      {/* Principal container */}
      <View className="relative w-full">
        {/* Search bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 shadow-lg">
          <Ionicons name="search" size={20} color="#00BCD4" />
          <TextInput
            className="flex-1 ml-3 h-fit text-base text-neutral-800"
            placeholder="Buscar lugar en el mapa..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={handleClearSearch}
              className="ml-2 h-6 w-6 justify-center items-center"
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown with results */}
        {showDropdown && Array.isArray(filteredLocations) && filteredLocations.length > 0 && (
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ],
              }
            ]}
            className="absolute top-full left-0 right-0 bg-white rounded-xl mt-2 shadow-xl elevation-5 max-h-64 z-10"
          >
            <FlatList
              data={filteredLocations}
              keyExtractor={item => item.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  className={`px-4 py-4 ${
                    index !== filteredLocations.length - 1 ? 'border-b border-neutral-100' : ''
                  }`}
                  onPress={() => handleSelectItem(item)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <Ionicons 
                      name="location-outline" 
                      size={16} 
                      color="#00BCD4" 
                      className="mr-3" 
                    />
                    <View className="flex-1">
                      <Text className="text-base text-neutral-800 font-medium">
                        {item.nombre}
                      </Text>
                      {item.tipo?.nombre && (
                        <Text className="text-sm text-neutral-500 mt-1">
                          {item.tipo.nombre}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default MapSearchBar;