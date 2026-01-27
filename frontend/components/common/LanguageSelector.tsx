import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type LanguageCode = 'es' | 'en' | 'gl';

type LanguageSelectorProps = {
  selectedLanguage: string;
  onSelect: (language: string) => void;
};

const languageData: Record<LanguageCode, { flag: string; name: string }> = {
  es: { flag: '🇪🇸', name: 'Español' },
  en: { flag: '🇬🇧', name: 'English' },
  gl: { flag: '🇪🇸', name: 'Galego' },
};

const availableLanguages: LanguageCode[] = ['es', 'gl', 'en'];

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
        onPress={() => onSelect('gl')}
      >
        <Text style={{ fontSize: 32, marginBottom: 4 }}>
          🇪🇸
        </Text>
        <Text 
          style={{ 
            fontSize: 12,
            fontWeight: selectedLanguage === 'gl' ? '600' : '400',
            color: selectedLanguage === 'gl'
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