import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

import { setLocale } from '@/app/i18n/i18n.config';
import Text from '@/components/common/Text';
import SettingsSwitch from '@/components/settings/SettingsSwitch';
import { createDatabase, deleteDatabase } from '@/utils/database';
import { Picker } from '@react-native-picker/picker';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const db = useSQLiteContext();
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  
  const locales = [
    { code: 'es', label: 'español' },
    { code: 'en', label: 'english' },
    { code: 'gal', label: 'galego' }
  ];

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setLocale(value);
  };
  
  return (
    <ScrollView 
      style={{ 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#F3F2F8' }} 
        contentContainerStyle={{ padding: 16, paddingTop: 110 }}
    >
                  <Text className="font-sans-bold text-textSecondary ml-8 mb-2">Idioma</Text>

    <View className="flex flex-col gap-6">
      
      <View className="bg-white px-8 py-4 rounded-[48px]">
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={handleLanguageChange}
        >
          {locales.map(locale => (
            <Picker.Item key={locale.code} label={locale.label} value={locale.code} />
          ))}
        </Picker>
      </View>
    </View>    

    </ScrollView>
  )
}

export default SettingsPage