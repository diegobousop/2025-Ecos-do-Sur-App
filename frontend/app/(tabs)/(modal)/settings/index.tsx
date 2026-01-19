import React from 'react'
import { ScrollView, useColorScheme, View, Image } from 'react-native'

import AccountSection from '@/components/settings/AccountSection'
import AppSection from '@/components/settings/AppSection';
import LogOutSection from '@/components/settings/LogOutSection';
import { useAuth } from '@/contexts/AuthContext';
import Text from '@/components/common/Text'


const SettingsPage = () => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  return (
    <ScrollView 
      style={{ 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#F3F2F8' }} 
        contentContainerStyle={{ padding: 16, paddingTop: 110 }}
    >
      
      <View className="flex flex-col gap-6">
        <AccountSection user={user} />
        <AppSection />
        <LogOutSection />
      </View>
      <Text className="text-center text-gray-500 mt-10 mb-5">Ecos do Sur App v1.2.0</Text>
    </ScrollView>

  )
}

export default SettingsPage