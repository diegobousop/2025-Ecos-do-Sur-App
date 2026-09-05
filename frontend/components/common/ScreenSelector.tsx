import Text from '@/components/common/Text';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';


type ScreenSelectorProps = {
  additionalStyles?: string;
  svgIcon?: React.JSX.Element;
  iconName?: keyof typeof Ionicons.glyphMap; // Permite pasar cualquier icono de Ionicons
}
    

const ScreenSelector = ({ additionalStyles = '', svgIcon, iconName, selectedScreen }: ScreenSelectorProps & { selectedScreen: 'chat' | 'feed' }) => {
  const router = useRouter();

  const selectedStyles = 'p-3 border-2 border-[#BCB6DC] rounded-full ';
  const unselectedStyles = 'p-3 border-2 border-transparent rounded-full';

  return (
    <View className="absolute z-30 top-14 right-32  w-[50%]">
        <View className="flex flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/(drawer)/new')}
            className={(selectedScreen === 'chat' ? selectedStyles : unselectedStyles) + additionalStyles}
          >
              <Text className="font-sans-semibold">EcosBot</Text>

          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/(drawer)/feed')}
            className={(selectedScreen === 'feed' ? selectedStyles : unselectedStyles) + additionalStyles}>
              <Text className="font-sans-semibold">Centro de Ayuda</Text>
          </TouchableOpacity>
        </View>
    </View>

  )
}

export default ScreenSelector