import React from 'react';
import { Image, ScrollView, useColorScheme, View } from 'react-native';

import Text from '@/components/common/Text';
import AccountSection from '@/components/settings/AccountSection';
import AppSection from '@/components/settings/AppSection';
import LogOutSection from '@/components/settings/LogOutSection';
import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from '@/hooks/use-push-notifications';


const SettingsPage = () => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { expoPushToken } = usePushNotifications();

  console.log('Expo Push Token:', expoPushToken);
  
  return (
    <ScrollView 
      style={{ 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#F3F2F8' }} 
        contentContainerStyle={{ padding: 16, paddingTop: 110 }}
    >
      
      <View className="flex flex-col gap-6">
        <AccountSection 
          user={user} 
        />
        <AppSection />
        <LogOutSection />
      </View>
      <Image 
        source={require('@/assets/images/ecos-do-sur-logo-gray.png')} 
        style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 20 }} />
      <Text className={`text-center mt-4 mb-5 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Ecos do Sur App v1.3.0
      </Text>
      <Text className={`text-center mb-10 text-xs ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} selectable>
        {expoPushToken ?? 'No push token available'}
      </Text>
    </ScrollView>

  )
}

export default SettingsPage