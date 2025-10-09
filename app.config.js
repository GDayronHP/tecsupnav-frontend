import { config } from 'dotenv';
import 'dotenv/config';

export default
  {
    expo: {
      name: "TecsupNav",
      slug: "TecsupNav",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icons/icon.png",
      userInterfaceStyle: "light",
      newArchEnabled: true,
      scheme: "tecsupnav",
      platforms: ["ios", "android", "web"],
      deepLinking: true,
      splash: {
        image: "./assets/icons/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        bundleIdentifier: "com.tecsup.tecsupnav",
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/icons/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        edgeToEdgeEnabled: true,
        package: "com.tecsup.tecsupnav",
        intentFilters: [
          {
            action: "VIEW",
            data: [
              {
                scheme: "com.tecsup.tecsupnav"
              },
              {
                scheme: "tecsupnav"
              }
            ],
            category: ["BROWSABLE", "DEFAULT"]
          }
        ],
        config: {
          googleMaps: {
            apiKey: process.env.GOOGLE_MAPS_API_KEY,
          },
        }
      },
      web: {
        favicon: ""
      },
      plugins: [
        "expo-router",
        "expo-secure-store",
        // "react-native-maps",
      ]
      ,
      extra: {
        router: {},
        eas: {
          projectId: "ee593b5d-6f94-46ea-a58b-46daa5702247"
        },
        apiBaseUrl: process.env.API_BASE_URL,
        androidClientId: process.env.ANDROID_CLIENT_ID,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      }
    }
  }
