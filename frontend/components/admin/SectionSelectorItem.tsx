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


  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      className="rounded-full overflow-hidden"
    >
      
        <Text
          className={`text-lg font-semibold ${
            isActive
              ? 'text-black border-2 border-[#BCB6DC] rounded-full p-3 dark:text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
        </Text>
    </TouchableOpacity>
  );
};

export default SectionSelectorItem;
