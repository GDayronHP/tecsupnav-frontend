import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import "./styles/global.css"

export default function App() {
  return (
    <View classname="flex-1 items-center justify-center bg-black ">
      <Text className="text-2xl">Tecsup navigation</Text>
      <StatusBar style="auto" />
    </View>
  );
}
