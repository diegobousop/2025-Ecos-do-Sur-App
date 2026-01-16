import { useAuth } from '@/contexts/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, View, Image, TouchableWithoutFeedback, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import chatbotService from '@/utils/chatbotService';
import SubmitButton from '@/components/SubmitButton';
import ActionButton from '@/components/common/ActionButton';
import Text from '@/components/common/Text';
import { Ionicons } from '@expo/vector-icons';


export default function Login() {
  const colorScheme = useColorScheme()
  const router = useRouter();
  const { setSession, isSignedIn } = useAuth();
  const [userName, setUserName] = useState('diegoxdash 2');
  const [password, setPassword] = useState('123452');
  const [botResponse, setBotResponse] = useState<any>(null);

  const onDevSignIn = async () => {

    const response = await chatbotService.login(userName.trim(), password.trim());
    setBotResponse(response);
    if (!response.token) {
      return;
    }
    await setSession({
      token: response.token,
      user: response.user,
    }); 
  };

  const onGuestSignIn = async () => {
  router.push('/(tabs)/(drawer)/(chat)/new');
  }


  const onNavigateToLogin = () => {
    router.push('/login', { animation: 'slide_from_bottom' });
  }

  const onNavigateToRegister = () => {
    router.push('/register', { animation: 'slide_from_bottom' });
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/(drawer)/(chat)/new" />;
  }

  return (
    
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, padding: 30, justifyContent: 'flex-start', gap: 12, marginTop: 80}}>
       <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, flex : 1 }}>
        
        <Image 
          source={require('@/assets/images/ecos-logo.png')} 
          alt="EcosBot Illustration" resizeMode="contain" 
          className="w-36 h-36 mb-8 self-center" 
          />
        
        <Text className="text-center text-[28px] " style={{ fontFamily: 'Merriweather_400Regular', color: colorScheme === 'dark' ? 'white' : '#4054A1' }}>
          Ecos Bot
        </Text>

        <TouchableOpacity className="absolute top-2 right-2 bg-gray-400 rounded-full" onPress={() => { router.push('/(tabs)/(drawer)/(chat)/new') }}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>

       </View>
        

        <SubmitButton message="Continuar como invitado" onPress={onGuestSignIn} props={{ style: { marginTop: 16 } }} />


        <ActionButton iconName="log-in" message="Iniciar sesión" onPress={onNavigateToLogin} />

        <ActionButton iconName="person-add" message="Crear una cuenta nueva" onPress={onNavigateToRegister} />


        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          {botResponse && JSON.stringify(botResponse)}
        </Text>
    
      </View>
    </TouchableWithoutFeedback>
    </ScrollView>

  );
}