import Text from '@/components/common/Text';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

interface SectionSelectorItemProps {
  label: string;
  value: string;
  isActive: boolean;
  onPress: (value: string) => void;
}

const SectionSelectorItem: React.FC<SectionSelectorItemProps> = ({
  label,
  value,
  isActive,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const gradientColors = isActive
    ? isDark
      ? ['#2563eb', '#1e40af'] // blue-600 to blue-800
      : ['#60a5fa', '#3b82f6'] // blue-400 to blue-500
    : isDark
    ? ['#374151', '#1f2937'] // gray-700 to gray-800
    : ['transparent', 'transparent']; // gray-200 to gray-300

  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      className="rounded-full overflow-hidden"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingVertical: 8, paddingHorizontal: 16 }}
      >
        <Text
          className={`text-lg font-semibold ${
            isActive
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SectionSelectorItem;
