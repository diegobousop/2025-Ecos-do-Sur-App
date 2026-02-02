import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

import Text from '@/components/common/Text';
import SettingsSwitch from '@/components/settings/SettingsSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { createDatabase, deleteDatabase } from '@/utils/database';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';

const STORAGE_SEND_DATA_KEY = 'settings.sendDataToEcos';
const STORAGE_SAVE_CONVERSATIONS_KEY = 'settings.saveConversations';

const SettingsPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const db = useSQLiteContext();
  const { user } = useAuth();

  const [sendDataToEcos, setSendDataToEcos] = React.useState(false);
  const [saveConversations, setSaveConversations] = React.useState(true);

  // Cargar valores al iniciar
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const sendData = await SecureStore.getItemAsync(STORAGE_SEND_DATA_KEY);
        const saveConv = await SecureStore.getItemAsync(STORAGE_SAVE_CONVERSATIONS_KEY);

        if (sendData !== null) setSendDataToEcos(JSON.parse(sendData));
        if (saveConv !== null) setSaveConversations(JSON.parse(saveConv));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Función para actualizar sendDataToEcos
  const handleSendDataChange = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync(STORAGE_SEND_DATA_KEY, JSON.stringify(value));
      setSendDataToEcos(value);
    } catch (error) {
      console.error('Error saving sendDataToEcos:', error);
    }
  };

  // Función para actualizar saveConversations
  const handleSaveConversationsChange = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync(STORAGE_SAVE_CONVERSATIONS_KEY, JSON.stringify(value));
      setSaveConversations(value);
    } catch (error) {
      console.error('Error saving saveConversations:', error);
    }
  };

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
        value={sendDataToEcos}
        onValueChange={handleSendDataChange}
      />
      <SettingsSwitch 
        title="Guardar conversaciones"
        value={saveConversations}
        onValueChange={handleSaveConversationsChange}
      />
      <TouchableOpacity onPress={handleDeleteConversations} className=" bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full">
        <Text className="text-lg text-[#ff0000]">Eliminar todas las conversaciones</Text>
      </TouchableOpacity>
    </View>   

    </ScrollView>

  )
}

export default SettingsPage