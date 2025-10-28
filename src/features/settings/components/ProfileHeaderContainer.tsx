import { View, Text, TouchableOpacity, Animated, Image } from 'react-native'
import React from 'react'
import StatsContainer from './StatsContainer';
import { Ionicons } from '@expo/vector-icons';
import { FormattedUserProfile } from '../hooks/useFormattedProfile';

interface ProfileHeaderContainerProps {
    user: FormattedUserProfile;
}

export default function ProfileHeaderContainer({ user }: ProfileHeaderContainerProps) {
    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm" >
            <View className="items-center">
                {/* Avatar */}
                <Animated.View>
                    <View
                        className="w-20 h-20 bg-primary-500 rounded-full justify-center items-center mb-4 relative overflow-hidden"
                    >
                        {user.avatar ? (
                            <Image
                                source={{ uri: user.avatar }}
                                className="w-full h-full rounded-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="person" size={40} color="white" />
                        )}
                    </View>
                </Animated.View>

                {/* User Info */}
                <Text className="text-2xl font-bold text-neutral-900 mb-1">
                    {user.roleDisplay} Tecsup
                </Text>
                <Text className="text-lg text-neutral-600 mb-1">
                    {user.displayName}
                </Text>
                <Text className="text-sm text-neutral-500">
                    Miembro desde {user.memberSince}
                </Text>
            </View>

            {/* Stats */}
            <StatsContainer />

        </View>
    )
}