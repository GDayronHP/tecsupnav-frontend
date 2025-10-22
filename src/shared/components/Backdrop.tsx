import { Animated, TouchableOpacity } from 'react-native'
import React from 'react'
import { usePerformantAnimation } from '@hooks/usePerformantAnimation';
import { useAnimatedStyle } from 'react-native-reanimated';

interface BackdropProps {
    onClose?: () => void;
}

export default function Backdrop({ onClose }: BackdropProps) {
    const { animatedValue: overlayOpacity } = usePerformantAnimation(0);

    // Estilos animados
    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                overlayAnimatedStyle,
            ]}
        >
            <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={onClose}
            />
        </Animated.View>
    )
}