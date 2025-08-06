import React from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function MainScreen() {
  return (
    <SafeAreaView className="flex-1 bg-tecsup-surface">
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FD" />

      {/* Search header */}
      <View className="flex-row items-center px-4 py-3 gap-2">
        <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md">
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>

        <View className="flex-1 h-11 bg-white rounded-full px-4 justify-center shadow-md">
          <TextInput
            className="text-base text-neutral-800"
            placeholder="Buscar aquí"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center relative shadow-md">
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
          <View className="w-2 h-2 rounded-full bg-error-500 absolute top-2 right-2" />
        </TouchableOpacity>
      </View>

      {/* Campus information */}
      <View className="mx-4 my-2 bg-white rounded-2xl p-4 shadow-md">
        <View className="flex-row items-center mb-4">
          <View className="rounded-full justify-center items-center mr-3">
            <Image
              source={require('@assets/icons/logo.png')}
              className="w-[50px] h-[50px]"
              resizeMode="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-neutral-800 mb-1">
              Campus Universitario
            </Text>
            <Text className="text-sm text-neutral-500">
              5 ubicaciones disponibles
            </Text>
          </View>
        </View>

        <View className="border-t border-neutral-200 pt-4">
          <Text className="text-base font-medium text-neutral-800 mb-3">
            Leyenda:
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <Text className="text-sm text-neutral-500">Tu ubicación</Text>
            </View>
            <View className="flex-row items-center flex-1">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-sm text-neutral-500">Destino</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Placeholder map */}
      <View className="flex-1 mx-4 mb-5 rounded-2xl overflow-hidden relative">
        <View className="flex-1 bg-neutral-200 justify-center items-center rounded-2xl">
          <Text className="text-lg font-semibold text-neutral-500 mb-2">
            Mapa del Campus
          </Text>
          <Text className="text-sm text-neutral-400">
            Vista satelital del campus universitario
          </Text>
        </View>

        {/* Your location */}
        <View className="absolute bottom-20 left-1/2 -ml-[6px] items-center">
          <View className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
          <View className="bg-white px-2 py-1 rounded-md mt-2 shadow-md">
            <Text className="text-xs text-neutral-800 font-medium">Tu ubicación</Text>
          </View>
        </View>

        {/* Flash button */}
        <View className="absolute right-4 top-4">
          <TouchableOpacity className="w-11 h-11 rounded-full bg-error-500 justify-center items-center shadow-lg">
            <Ionicons name="flash" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Compass */}
        <View className="absolute right-4 bottom-4 items-center">
          <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center mb-1 shadow-md">
            <Ionicons name="compass-outline" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-xs text-neutral-500 font-medium">Norte</Text>
        </View>

        {/* Navigation */}
        <View className="absolute right-4 bottom-24">
          <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-md">
            <Ionicons name="navigate" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MainScreen;