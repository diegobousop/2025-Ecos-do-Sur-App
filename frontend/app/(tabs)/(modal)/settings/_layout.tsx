import { Stack, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('settings.modalTitle'),
    });
  }, [navigation, t]);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="storage" 
        options={{ 
          headerShown: false,
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="language" 
        options={{ 
          headerShown: false,
          presentation: 'card',
        }} 
      />

      <Stack.Screen 
        name="change-personal-info" 
        options={{
            headerShown: false,
            presentation: 'card',
          }} 
      />
    </Stack>
  );
}