import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

import Text from '@/components/common/Text';
import SettingsSwitch from '@/components/settings/SettingsSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import chatbotService from '@/utils/chatbotService';
import { createDatabase, deleteDatabase, deleteUserChats } from '@/utils/database';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';

const STORAGE_SEND_DATA_KEY = 'settings.sendDataToEcos';
const STORAGE_SAVE_CONVERSATIONS_KEY = 'settings.saveConversations';

const DebugRow = ({ label, value, isDark }: { label: string; value: string; isDark: boolean }) => (
  <View className="flex-row justify-between items-start py-1 gap-3">
    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</Text>
    <Text selectable className={`text-sm flex-1 text-right ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      {value}
    </Text>
  </View>
);

const SettingsPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;
  const { user, token, signOut } = useAuth();
  const router = useRouter();

  const {
    expoPushToken,
    error: pushError,
    permissionStatus,
    isDevice,
    projectId,
    refreshPushToken,
  } = usePushNotifications();
  const [refreshingToken, setRefreshingToken] = React.useState(false);

  const appVersion = Constants.expoConfig?.version ?? 'desconocida';

  const handleRefreshToken = async () => {
    setRefreshingToken(true);
    await refreshPushToken();
    setRefreshingToken(false);
  };

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
      {/* Panel de depuración: estado fundamental + token de notificaciones */}
      <View className={`rounded-3xl p-5 ${isDark ? 'bg-[#262626]' : 'bg-white'}`}>
        <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
          Debug — Estado
        </Text>

        <DebugRow label="Plataforma" value={`${Platform.OS} ${Device.osVersion ?? ''}`.trim()} isDark={isDark} />
        <DebugRow label="Dispositivo físico" value={isDevice ? 'Sí' : 'No (emulador)'} isDark={isDark} />
        <DebugRow label="Permiso notif." value={permissionStatus ?? 'desconocido'} isDark={isDark} />
        <DebugRow label="projectId" value={projectId ?? 'NO DEFINIDO'} isDark={isDark} />
        <DebugRow label="App version" value={appVersion} isDark={isDark} />
        <DebugRow label="Usuario" value={user?.id ? String(user.id) : 'sin sesión'} isDark={isDark} />
        <DebugRow label="Auth token" value={token ? 'presente' : 'ausente'} isDark={isDark} />

        <Text className={`text-sm font-semibold mt-3 mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Expo Push Token
        </Text>
        <Text
          selectable
          className={`text-xs ${expoPushToken ? (isDark ? 'text-green-400' : 'text-green-700') : 'text-red-500'}`}
        >
          {expoPushToken ?? 'null (no disponible)'}
        </Text>

        {pushError ? (
          <>
            <Text className="text-sm font-semibold mt-3 mb-1 text-red-500">Error</Text>
            <Text selectable className="text-xs text-red-500">
              {pushError}
            </Text>
          </>
        ) : null}

        <TouchableOpacity
          onPress={handleRefreshToken}
          disabled={refreshingToken}
          className="mt-4 flex-row justify-center items-center gap-2 px-6 py-4 rounded-full bg-blue-600"
          style={{ opacity: refreshingToken ? 0.6 : 1 }}
        >
          {refreshingToken ? <ActivityIndicator color="#fff" size="small" /> : null}
          <Text className="text-white text-base font-semibold">
            {refreshingToken ? 'Recargando…' : 'Recargar token'}
          </Text>
        </TouchableOpacity>
      </View>

      <SettingsSwitch
        title={t('settings.sendDataToEcos')}
        value={sendDataToEcos}
        onValueChange={handleSendDataChange}
      />
      <SettingsSwitch 
        title={t('settings.saveConversations')}
        value={user ? saveConversations : false}
        onValueChange={handleSaveConversationsChange}
        disabled={!user}
      />
      <TouchableOpacity 
        onPress={handleDeleteConversations} 
        className={` bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full 
          ${colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}`}>
        <Text className="text-lg text-[#ff0000]">
          {t('settings.storageDeleteConversations')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleDeleteAccount} 
        className={` bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full 
          ${colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}`} disabled={!user}>
        <Text className="text-lg text-[#ff0000]" style={{ opacity: user ? 1 : 0.5 }}>
          {t('settings.storageDeleteAccount')}
        </Text>
      </TouchableOpacity>
    </View>   
    </ScrollView>

  )
}

export default SettingsPage