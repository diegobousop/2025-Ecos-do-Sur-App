import React from 'react';
import { ScrollView, useColorScheme, View } from 'react-native';

import { setLocale } from '@/app/i18n/i18n.config';
import LanguageSelector from '@/components/common/LanguageSelector';
import Text from '@/components/common/Text';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { i18n, t } = useTranslation();
  const colorScheme = useColorScheme();

  const handleLanguageChange = (value: string) => {
    setLocale(value);
  };
  
  return (
    <ScrollView 
      style={{ 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#F3F2F8' }} 
        contentContainerStyle={{ padding: 16, paddingTop: 110 }}
    >
    <Text 
      className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-textSecondary'}`}>
        {t('settings.language')}
    </Text>

    <View className="flex flex-col gap-6">
      
      <View className={`${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} px-4 py-4 rounded-[48px]`}>
        
        <LanguageSelector
          selectedLanguage={i18n.language}
          onSelect={handleLanguageChange}
        />
      </View>
    </View>    

    </ScrollView>
  )
}

export default SettingsPage