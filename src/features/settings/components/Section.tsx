import { View, Text } from 'react-native';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
      return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-neutral-900 mb-3">
        {title}
      </Text>
      {children}
    </View>
  )
}
