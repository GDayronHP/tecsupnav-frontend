import { View, Text, TouchableOpacity, Animated } from 'react-native'
import React from 'react'
import { runOnJS, useAnimatedStyle } from 'react-native-reanimated';
import { useButtonScale } from '@hooks/usePerformantAnimation';

export default function AnimatedButton({ children, onPress, className }: {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
}) {
    const { scale, scaleDown, scaleUp } = useButtonScale();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handlePressIn = () => {
        scaleDown();
    };

    const handlePressOut = () => {
        scaleUp();
    };

    const handlePress = () => {
        if (onPress) {
            runOnJS(onPress)();
        }
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            activeOpacity={1}
        >
            <Animated.View style={[animatedStyle]} className={className}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
}