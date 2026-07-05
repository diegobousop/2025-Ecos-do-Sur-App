import React from 'react';
import { Image, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type LanguageCode = 'es' | 'en' | 'gal';

type LanguageSelectorProps = {
  selectedLanguage: string;
  onSelect: (language: string) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onSelect 
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex flex-row justify-between px-5 py-2  border-white h-[83px] rounded-full">
      {/* Español */}
      <TouchableOpacity
        onPress={() => onSelect('es')}
      >         
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          🇪🇸
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedLanguage === 'es' ? '600' : '400',
            color: selectedLanguage === 'es'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          Español
        </Text>
      </TouchableOpacity>

      {/* Galego */}
      <TouchableOpacity
        onPress={() => onSelect('gal')}
      >
        <Image 
          source={require('@/assets/images/bandeira-galicia.png')} 
          style={{ width: 45, height: 45 }}
          resizeMode="contain"
        />
        <Text 
          style={{ 
            marginBottom:2,
            fontSize: 12,
            fontWeight: selectedLanguage === 'gal' ? '600' : '400',
            color: selectedLanguage === 'gal'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          Galego
        </Text>
      </TouchableOpacity>

      {/* English */}
      <TouchableOpacity
        onPress={() => onSelect('en')}
      >
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          🇬🇧
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedLanguage === 'en' ? '600' : '400',
            color: selectedLanguage === 'en'
              ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
              : (colorScheme === 'dark' ? '#fff' : '#333'),
          }}
        >
          English
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelector;