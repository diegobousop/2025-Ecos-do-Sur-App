import ActionButton from '@/components/common/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import chatbotService from '@/utils/chatbotService';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, Keyboard, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';



export default function Login() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession, isSignedIn } = useAuth();
  const [identifier, setIdentifier] = useState('diegoxdash 2');
  const [password, setPassword] = useState('123452');
  const [botResponse, setBotResponse] = useState<any>(null);

  const [identifierErrors, setIdentifierErrors] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string>("");
  
  const [step, setStep] = useState<1 | 2>(1);
  
  const identifierInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        identifierInputRef.current?.focus();
      } else {
        passwordInputRef.current?.focus();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [step]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: step === 2 ? () => (
        <TouchableOpacity
          onPress={() => setStep(1)}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '90deg' }] }}
        >
          <svgIcons.ArrowIcon />
        </TouchableOpacity>
      ) : undefined,
    });
  }, [navigation, step]);

  const onDevSignIn = async () => {
    setLoading(true);
    setPasswordErrors("");
    
    if (!checkCredentials()) {
      setLoading(false);
      return;
    }
    try{
      const response = await chatbotService.login(identifier.trim(), password.trim());
      setBotResponse(response);
      
      if (response.error) {
        if (response.error === "invalid_credentials") {
          setPasswordErrors("Contraseña incorrecta.");
        } else {
          setPasswordErrors("Error al iniciar sesión. Intenta de nuevo.");
        }
        setLoading(false);
        return;
      }
      
      if (!response.token) {
        setPasswordErrors("Error al iniciar sesión. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      
      await setSession({
        token: response.token,
        user: response.user,
      }); 
    }catch (error) {
      console.error('Error during login:', error);
      setPasswordErrors("Error al iniciar sesión. Intenta de nuevo.");
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
    if (identifier.trim().length === 0) {
      setIdentifierErrors("El nombre de usuario no puede estar vacío.");
      failedChecks = true;
    }
    if (password.trim().length === 0) {
      setPasswordErrors("La contraseña no puede estar vacía.");
      failedChecks = true;
    }

    return !failedChecks;
  }

  const onNextStep = async () => {
    setIdentifierErrors("");
    if (identifier.trim().length === 0) {
      setIdentifierErrors("El campo no puede estar vacío.");
      return;
    }

    setLoading(true);
    try {
      const response = await chatbotService.checkUserExists(identifier.trim());
      
      if (!response.exists) {
        setIdentifierErrors("Este usuario no existe.");
        return;
      }
      
      setStep(2);
    } catch (error) {
      console.error('Error checking user:', error);
      setIdentifierErrors("Error al verificar el usuario. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
      <LinearGradient colors={['#BCE0FF', '#ffffff']} start={{ x: 0, y: 2 }} end={{ x: 0, y: 0 }} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, padding: 30, justifyContent: 'flex-start', gap: 5}}>
          <Image 
            source={require('@/assets/images/ecos-logo.png')} 
            alt="EcosBot Illustration" resizeMode="contain" 
            className="w-16 h-16 mb-2 self-center" 
            />
          
          <Text className="text-center font-sans" style={{ fontSize: 24 }}>Inicia sesión</Text>
          <Text className="text-center text-regular color-textSecondary mb-4">Obtendrás historial de conversaciones y contenido personalizado</Text>
          
          {step === 1 ? (
            <>
              <CustomTextInput
                ref={identifierInputRef}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Correo electrónico o nombre de usuario"
                keyboardType="email-address"
                errors={identifierErrors}
              />

              {identifierErrors.length > 0 && (
                <View className="flex flex-row items-center">
                  <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
                  <Text className="flex-1 text-left text-sm color-textSecondary">{identifierErrors}</Text>
                </View>
              )}

              <SubmitButton message="Siguiente" onPress={onNextStep} props={{ style: { marginTop: 10 } }} loading={loading} />

              <Text style={{ textAlign: 'center' }}>- o -</Text>

              <ActionButton iconName="person-add" message="Crear una cuenta nueva" onPress={onNavigateToRegister} />
            </>
          ) : (
            <>
              <CustomTextInput
                ref={passwordInputRef}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                keyboardType='default'
                secureTextEntry={true}
                errors={passwordErrors}
              />

              {passwordErrors.length > 0 && (
                <View className="flex flex-row items-center">
                  <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
                  <Text className="flex-1 text-left text-sm color-textSecondary">{passwordErrors}</Text>
                </View>
              )}

              <SubmitButton 
                message="Continuar" 
                onPress={onDevSignIn} 
                props={{ style: { marginTop: 16 } }}
                loading={loading} />
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      </LinearGradient>
    </ScrollView>

  );
}