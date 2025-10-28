import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";

interface LoadingProps {
    title?: string;
    description?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
}

export default function Loading({ title, description, iconName }: LoadingProps) {

    return (
        <Animated.View
            className="absolute inset-0 z-[100] justify-center items-center bg-tecsup-surface"
        >
            <View className="items-center">
                <View className="w-20 h-20 rounded-[20px] bg-primary-500 justify-center items-center mb-6 shadow-card">
                    <Ionicons name={iconName || "hourglass-outline"} size={48} color="white" />
                </View>
                {title && (
                    <>
                        <Text className="text-[20px] font-semibold text-neutral-700 mb-2">
                            {title}
                        </Text>
                    </>

                )}
                {description && (
                    <Text className="text-body text-neutral-500 mb-8">
                        {description}
                    </Text>
                )}
                <ActivityIndicator
                    size="large"
                    color="#00BCD4"
                    style={{ transform: [{ scale: 1.2 }] }}
                />
            </View>
        </Animated.View>
    )
}