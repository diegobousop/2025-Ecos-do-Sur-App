import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import CustomTextInput from '@/components/common/CustomTextInput';

import Text from '@/components/common/Text';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SubmitButton from '@/components/SubmitButton';
import chatbotService from '@/utils/chatbotService';


const ChangePersonalInfoPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangeUsername = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'El nombre de usuario no puede estar vacío');
      return;
    }
    
    Alert.alert(
      'Confirmar cambio',
      `¿Deseas cambiar tu nombre de usuario a "${username}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            if (!user) return;
            try{
              chatbotService.updateUsername(user?.id, username);
              Alert.alert('Éxito', 'Nombre de usuario actualizado');
            }catch(error){
              Alert.alert('Error', 'No se pudo actualizar el nombre de usuario');
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    Alert.alert(
      'Confirmar cambio',
      '¿Deseas cambiar tu contraseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // TODO: Implementar llamada al backend
            Alert.alert('Éxito', 'Contraseña actualizada');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView 
      style={{ 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#F3F2F8' }} 
        contentContainerStyle={{ padding: 16, paddingTop: 110 }}
    >
    <Text className="font-sans-bold text-textSecondary ml-8 mb-2">Cambiar nombre de usuario</Text>
    <View className="flex flex-col gap-6">
      
      {/* Cambiar nombre de usuario */}
      
      <View className="bg-white rounded-[28px]" style={{ padding: 16 }}>
        
        <View className="flex flex-col gap-3">
          <CustomTextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nuevo nombre de usuario"
            className="bg-gray-100 rounded-full px-4 py-3"
          />
          <SubmitButton message={t("settings.change-username")}  onPress={handleChangeUsername} />
        </View>
      </View>

      {/* <Text className="font-sans-bold text-textSecondary ml-8 mb-2">Cambiar contraseña</Text>
      <View className="bg-white rounded-[28px]" style={{ padding: 16 }}>
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Contraseña actual</Text>
          <View className="flex flex-row items-center w-full">
            <CustomTextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Contraseña actual"
              secureTextEntry={!showCurrentPassword}
              
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Ionicons 
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="gray" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Nueva contraseña</Text>
          <View className="bg-gray-100 rounded-full px-4 py-3 flex-row items-center">
            <CustomTextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons 
                name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="gray" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Confirmar contraseña</Text>
          <View className="bg-gray-100 rounded-full px-4 py-3 flex-row items-center">
            <CustomTextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar contraseña"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="gray" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <SubmitButton message={t("settings.change-password")}  onPress={handleChangePassword} />

      </View> */}

    </View>    

    </ScrollView>

  )
}

export default ChangePersonalInfoPage