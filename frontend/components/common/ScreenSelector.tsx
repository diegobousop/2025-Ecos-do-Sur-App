import Text from '@/components/common/Text';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';


type ScreenSelectorProps = {
  onPress: () => void;
  additionalStyles?: string;
  svgIcon?: React.JSX.Element;
  iconName?: keyof typeof Ionicons.glyphMap; // Permite pasar cualquier icono de Ionicons
}
    

const ScreenSelector = ({ onPress, additionalStyles = '', svgIcon, iconName }: ScreenSelectorProps) => {
  const router = useRouter();

  return (
    <View className="absolute top-20 right-28 w-[50%]">
        <View className="flex flex-row">
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/(drawer)/explore')}
          className={' border-2 border-[#BCB6DC] rounded-full ' + additionalStyles}
        >
            <Text>EcosBot</Text>

        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} className={' border-2 border-[#BCB6DC] rounded-full ' + additionalStyles}>
            <Text>Ecos do Sur</Text>
        </TouchableOpacity>
        </View>
    </View>
    
  )
}

const styles = {
  blur: {
    padding: 10,
    borderRadius: 9999, // Clase para hacer el borde completamente redondeado
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default ScreenSelector