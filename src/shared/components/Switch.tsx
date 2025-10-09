
import settings from '@app/(tabs)/settings'
import { View, TouchableOpacity } from 'react-native'

interface SwitchProps {
    isOn: boolean;
    onToggle: (newState: boolean) => void;
}

export default function Switch({ isOn, onToggle }: SwitchProps) {
    return (
        <TouchableOpacity
            onPress={() => onToggle(!isOn)}
            className={`relative w-12 h-7 rounded-full ${isOn ? 'bg-primary-500' : 'bg-neutral-300'
                }`}
        >
            <View
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm ${isOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </TouchableOpacity>
    )
}