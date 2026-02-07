import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, Platform, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

import Text from '@/components/common/Text';
import SettingsSwitch from '@/components/settings/SettingsSwitch';
import { useAuth } from '@/contexts/AuthContext';
import chatbotService from '@/utils/chatbotService';
import { createDatabase, deleteDatabase, deleteUserChats } from '@/utils/database';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';

const STORAGE_SEND_DATA_KEY = 'settings.sendDataToEcos';
const STORAGE_SAVE_CONVERSATIONS_KEY = 'settings.saveConversations';

const SettingsPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;
  const { user, token, signOut } = useAuth();
  const router = useRouter();

  const [sendDataToEcos, setSendDataToEcos] = React.useState(false);
  const [saveConversations, setSaveConversations] = React.useState(true);

  // Cargar valores al iniciar
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const sendData = await SecureStore.getItemAsync(STORAGE_SEND_DATA_KEY);
        const saveConv = await SecureStore.getItemAsync(STORAGE_SAVE_CONVERSATIONS_KEY);

        if (sendData !== null) setSendDataToEcos(JSON.parse(sendData));
        if (saveConv !== null) {
          // Si el usuario es null, forzar saveConversations a false
          setSaveConversations(user ? JSON.parse(saveConv) : false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, [user]);

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
    // Si el usuario es null, no permitir activar
    if (!user && value) {
      return;
    }
    
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
    if (!db) {
      Alert.alert('No disponible', 'Esta función no está disponible en la versión web.');
      return;
    }
    
    return (Alert.alert(t('drawer.delete_title'), t('drawer.delete_message'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const currentUserId = user?.id || null;
          await deleteUserChats(db, currentUserId);
        }
      }
    ]));
  }

  const handleDeleteAccount = () => {
    if (!user || !token) {
      Alert.alert('Error', 'Debes iniciar sesión para eliminar tu cuenta');
      return;
    }

    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y se eliminarán todos tus datos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await chatbotService.deleteAccount(token);
              
              if (result.success) {
                // Eliminar conversaciones locales si existen
                if (db) {
                  await deleteDatabase(db);
                  await createDatabase(db);
                }
                
                // Cerrar sesión
                await signOut();
                
                // Redirigir a la pantalla de inicio
                router.replace('/intro');
                
                Alert.alert('Éxito', 'Tu cuenta ha sido eliminada correctamente');
              } else {
                Alert.alert('Error', `No se pudo eliminar la cuenta: ${result.error}`);
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar la cuenta');
            }
          },
        },
      ]
    );
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
        value={user ? saveConversations : false}
        onValueChange={handleSaveConversationsChange}
        disabled={!user}
      />
      <TouchableOpacity onPress={handleDeleteConversations} className=" bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full">
        <Text className="text-lg text-[#ff0000]">Eliminar todas las conversaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount} className=" bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full" disabled={!user}>
        <Text className="text-lg text-[#ff0000]" style={{ opacity: user ? 1 : 0.5 }}>Eliminar cuenta</Text>
      </TouchableOpacity>
    </View>   
    </ScrollView>

  )
}

export default SettingsPage