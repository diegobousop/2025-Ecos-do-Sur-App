import React from 'react';
import { Alert, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

import Text from '@/components/common/Text';
import SettingsSwitch from '@/components/settings/SettingsSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { createDatabase, deleteDatabase } from '@/utils/database';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';


const SettingsPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const db = useSQLiteContext();
  const { user, token } = useAuth();

  React.useEffect(() => {
    console.log('Storage page - User:', user);
  }, [user]);

  const handleDeleteConversations = () => {
    return (Alert.alert(t('drawer.delete_title'), t('drawer.delete_message'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteDatabase(db);
          await createDatabase(db);
        }
      }
    ]));
  }
  
  return (
    <ScrollView 
      style={{ 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#F3F2F8' }} 
        contentContainerStyle={{ padding: 16, paddingTop: 110 }}
    >
    <View className="flex flex-col gap-6">
      <SettingsSwitch 
        title="Enviar datos a Ecos do Sur"
        />
      <SettingsSwitch 
        title="Guardar conversaciones"
      />
      <TouchableOpacity onPress={handleDeleteConversations} className=" bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full">
        <Text className="text-lg text-[#ff0000]">Eliminar todas las conversaciones</Text>
      </TouchableOpacity>
      <Text className="text-lg text-white">{JSON.stringify(user, null, 2)}</Text>
      <Text className="text-lg text-white">{token}</Text>
    </View>   

    </ScrollView>

  )
}

export default SettingsPage