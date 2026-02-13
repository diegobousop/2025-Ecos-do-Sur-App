import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type GenderCode = 'male' | 'female' | 'other' | 'prefer_not_say';

type GenderSelectorProps = {
  selectedGender: string;
  onSelect: (gender: string) => void;
};

const GenderSelector: React.FC<GenderSelectorProps> = ({ 
  selectedGender, 
  onSelect 
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex flex-row justify-between px-3">
      {/* Masculino */}
      <TouchableOpacity
        onPress={() => onSelect('male')}
        style={{ alignItems: 'center' }}
      >
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          👨
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedGender === 'male' ? '600' : '400',
            color: selectedGender === 'male'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          Masculino
        </Text>
      </TouchableOpacity>

      {/* Femenino */}
      <TouchableOpacity
        onPress={() => onSelect('female')}
        style={{ alignItems: 'center' }}
      >
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          👩
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedGender === 'female' ? '600' : '400',
            color: selectedGender === 'female'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          Femenino
        </Text>
      </TouchableOpacity>

      {/* Otro */}
      <TouchableOpacity
        onPress={() => onSelect('other')}
        style={{ alignItems: 'center' }}
      >
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          ⚧️
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedGender === 'other' ? '600' : '400',
            color: selectedGender === 'other'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          Otro
        </Text>
      </TouchableOpacity>

      {/* Prefiero no decirlo */}
      <TouchableOpacity
        onPress={() => onSelect('prefer_not_say')}
        style={{ alignItems: 'center' }}
      >
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          🤐
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedGender === 'prefer_not_say' ? '600' : '400',
            color: selectedGender === 'prefer_not_say'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          Prefiero no decir
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenderSelector;
