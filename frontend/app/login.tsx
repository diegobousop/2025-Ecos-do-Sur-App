import ActionButton from '@/components/common/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import chatbotService from '@/utils/chatbotService';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native';



export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession, isSignedIn } = useAuth();
  const [userName, setUserName] = useState('diegoxdash 2');
  const [password, setPassword] = useState('123452');
  const [botResponse, setBotResponse] = useState<any>(null);

  const [userNameErrors, setUserNameErrors] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string>("");

  const onDevSignIn = async () => {
    setLoading(true);
    checkCredentials();
    try{
      const response = await chatbotService.login(userName.trim(), password.trim());
      setBotResponse(response);
      if (!response.token) {
        return;
      }
      await setSession({
        token: response.token,
        user: response.user,
      }); 
    }catch (error) {
      console.error('Error during login:', error);
      setErrors(error.message || 'An unexpected error occurred. Please try again.');
    }
    finally{
      setLoading(false);
    }
  };

  const onNavigateToRegister = () => {
    router.push('/intro', { animation: 'slide_from_bottom' });
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/(drawer)/(chat)/new" />;
  }

  const checkCredentials = () => {
    let failedChecks = false;
    if (userName.trim().length === 0) {
      setUserNameErrors("El nombre de usuario no puede estar vacío.");
      failedChecks = true;
    }
    if (password.trim().length === 0) {
      setPasswordErrors("La contraseña no puede estar vacía.");
      failedChecks = true;
    }
    if ( (password.trim().length <= 6) || !/[!@#$%^&*(),.?":{}|<>]/g.test(password) ) {
      setPasswordErrors("La contraseña debe tener al menos 6 caracteres y un caracter especial.");
      failedChecks = true;
    }

    if (!failedChecks) {return;}
  }

  return (
    
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, padding: 30, justifyContent: 'flex-start', gap: 12, marginTop: 80}}>
       
        <Image 
          source={require('@/assets/images/ecos-logo.png')} 
          alt="EcosBot Illustration" resizeMode="contain" 
          className="w-16 h-16 mb-2 self-center" 
          />
        
        <Text className="text-center font-sans" style={{ fontSize: 24 }}>Inicia sesión</Text>
        <Text className="text-center text-regular color-textSecondary mb-4">Obtendrás historial de conversaciones y contenido personalizado</Text>
        <CustomTextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Nombre de usuario"
          keyboardType="default"
          errors={userNameErrors}
        />
  
        <CustomTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          keyboardType='default'
          secureTextEntry={true}
          errors={passwordErrors}
        />

        <View className='flex flex-col items-center'>
          <View className="flex flex-row items-center">
            {userNameErrors.length > 0 ? (
              <>
              <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
              <Text className="flex-1 text-left text-sm color-textSecondary">{userNameErrors}</Text>
              </>
            ): null}
            
            
          </View>
              <View className="flex flex-row items-center">
          {passwordErrors.length > 0 ? (
              <>
              <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
              <Text className="flex-1 text-left text-sm color-textSecondary">{passwordErrors}</Text>
              </>
            ): null}

          </View>
        </View>

        <SubmitButton message="Continuar" onPress={onDevSignIn} props={{ style: { marginTop: 16 } }} />

        

        <Text  style={{ textAlign: 'center' }}>- o -</Text>

        <ActionButton iconName="person-add" message="Crear una cuenta nueva" onPress={onNavigateToRegister} />



        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          {botResponse && JSON.stringify(botResponse)}
        </Text>
    
      </View>
    </TouchableWithoutFeedback>
    </ScrollView>

  );
}