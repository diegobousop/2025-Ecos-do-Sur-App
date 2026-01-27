import ActionButton from '@/components/common/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import GenderSelector from '@/components/common/GenderSelector';
import LanguageSelector from '@/components/common/LanguageSelector';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import chatbotService from '@/utils/chatbotService';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, Keyboard, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';



type Language = 'es' | 'gl' | 'en';
type Gender = 'male' | 'female' | 'other' | 'prefer_not_say';

export default function Register() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const router = useRouter();
  const { setSession, isSignedIn } = useAuth();
  const colorScheme = useColorScheme();
  
  const emailInputRef = useRef<TextInput>(null);
  const userNameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const code1InputRef = useRef<TextInput>(null);
  const code2InputRef = useRef<TextInput>(null);
  const [verificationCode1, setVerificationCode1] = useState('');
  const [verificationCode2, setVerificationCode2] = useState('');
  const [verificationCodeErrors, setVerificationCodeErrors] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState<Language>('es');
  const [gender, setGender] = useState<Gender | "">("");
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState<string>("");
  const [userNameErrors, setUserNameErrors] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string>("");
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        emailInputRef.current?.focus();
      } else if (step === 2) {
        userNameInputRef.current?.focus();
      } else if (step === 3) {
        passwordInputRef.current?.focus();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [step]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: step > 1 ? () => (
        <TouchableOpacity
          onPress={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <svgIcons.ArrowIcon 
            width={24} 
            height={24} 
            style={{ transform: [{ rotate: '90deg' }] }} 
          />
        </TouchableOpacity>
      ) : undefined,
    });
  }, [navigation, step]);

  const languages: { value: Language; label: string }[] = [
    { value: 'es', label: 'Español' },
    { value: 'gl', label: 'Gallego' },
    { value: 'en', label: 'Inglés' },
  ];

  const genders: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' },
    { value: 'prefer_not_say', label: 'Prefiero no decirlo' },
  ];

  const handleNextFromStep1 = async () => {
    setEmailErrors("");
    if (!email.trim()) {
      setEmailErrors('El email es requerido');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailErrors('Email inválido');
      return;
    }

    setLoading(true);
    try {
      const response = await chatbotService.checkUserExists(email.trim());
      
      if (response.exists) {
        setEmailErrors('Este email ya está registrado');
        return;
      }
      
      setStep(2);
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailErrors('Error al verificar el email. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromStep2 = async () => {
    setUserNameErrors("");
    
    if (!userName.trim()) {
      setUserNameErrors('El nombre de usuario es requerido');
      return;
    }

    setLoading(true);
    try {
      const response = await chatbotService.checkUserExists(userName.trim());
      
      if (response.exists) {
        setUserNameErrors('Este nombre de usuario ya está en uso');
        return;
      }
      
      setStep(3);
    } catch (error) {
      console.error('Error checking username:', error);
      setUserNameErrors('Error al verificar el nombre de usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromStep3 = () => {
    setPasswordErrors("");
    setConfirmPasswordErrors("");
    
    if (!password.trim() || password.trim().length < 6) {
      setPasswordErrors('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordErrors('Las contraseñas no coinciden');
      return;
    }
    
    setStep(4);
  };

  const handleNextFromStep4 = async () => {
    if (!gender) {
      setError('Por favor, selecciona un género');
      return;
    }

    setLoading(true);
    setVerificationCodeErrors('');
    try {
      console.warn('Requesting signup code for:', email.trim());
      await chatbotService.requestSignUpCode(email.trim());
      setVerificationCode1('');
      setVerificationCode2('');
      setStep(5);
    } catch (err: any) {
      if (err?.status === 409) {
        setEmailErrors('Este email ya está registrado');
        setStep(1);
      } else if (err?.status === 429) {
        setVerificationCodeErrors('Ya enviamos un código recientemente. Espera unos segundos e inténtalo de nuevo.');
        setStep(5);
      } else if (err?.status === 400) {
        setEmailErrors('Email inválido');
        setStep(1);
      } else {
        setVerificationCodeErrors('No pudimos enviar el código. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignUp = async () => {
    setVerificationCodeErrors('');
    const fullCode = verificationCode1 + verificationCode2;
    
    if (fullCode.length !== 6) {
      setVerificationCodeErrors('Por favor, introduce el código completo');
      return;
    }

    setLoading(true);
    try {
      await chatbotService.verifySignUpCode(email.trim(), fullCode);
      const response = await chatbotService.register(userName.trim(), email.trim(), password.trim(), language, gender, fullCode);
      if (!response.token) {
        setVerificationCodeErrors('Error al crear la cuenta. Intenta de nuevo.');
        return;
      }
      await setSession({
        token: response.token,
        user: response.user,
      });
      router.push('/(tabs)/(drawer)/(chat)/new');
    } catch (error) {
      console.error('Error verifying code:', error);
      if ((error as any)?.status === 400) {
        setVerificationCodeErrors('Código incorrecto. Intenta de nuevo.');
      } else if ((error as any)?.status === 410) {
        setVerificationCodeErrors('El código expiró. Solicita uno nuevo.');
      } else if ((error as any)?.status === 404) {
        setVerificationCodeErrors('Primero solicita un código de verificación.');
      } else {
        setVerificationCodeErrors('No pudimos verificar el código. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setVerificationCodeErrors('');
    setResendLoading(true);
    try {
      await chatbotService.requestSignUpCode(email.trim());
    } catch (error: any) {
      if (error?.status === 429) {
        setVerificationCodeErrors('Espera unos segundos antes de reenviar otro código.');
      } else {
        setVerificationCodeErrors('No pudimos reenviar el código. Intenta de nuevo.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    setError(null);
  };

  const onNavigateToLogin = () => {
    router.push('/login');
  };

  if (isSignedIn) {
    return <Redirect href="/(tabs)/(drawer)/(chat)/new" />;
  }

  const SelectOption = ({ 
    selected, 
    label, 
    onPress 
  }: { 
    selected: boolean; 
    label: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: selected ? '#4054A1' : '#ccc',
        backgroundColor: selected 
          ? (colorScheme === 'dark' ? '#4054A1' : '#E8EDFA') 
          : (colorScheme === 'dark' ? '#1e1e1e' : '#fff'),
      }}
    >
      <Text style={{ 
        color: selected 
          ? (colorScheme === 'dark' ? '#fff' : '#4054A1') 
          : (colorScheme === 'dark' ? '#fff' : '#333'),
        fontWeight: selected ? '600' : '400',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={['#BCE0FF', '#ffffff']} start={{ x: 0, y: 2 }} end={{ x: 0, y: 0 }} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, padding: 30, justifyContent: 'flex-start', gap: 8 }}>
            <Image 
              source={require('@/assets/images/ecos-logo.png')} 
              alt="EcosBot Illustration" resizeMode="contain" 
              className="w-16 h-16 mb-2 self-center" 
            />
            
            <Text className="text-center font-sans" style={{ fontSize: 24 }}>Crear cuenta</Text>
            <Text className="text-center text-regular color-textSecondary mb-4">
              {step === 1 ? 'Introduce tu email' : step === 2 ? 'Nombre de usuario' : step === 3 ? 'Crea tu contraseña' : step === 4 ? 'Personaliza tu experiencia' : 'Verifica tu email'}
            </Text>


            {step === 1 ? (
              <>
                <CustomTextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  errors={emailErrors}
                />

                {emailErrors.length > 0 && (
                  <View className="flex flex-row items-center">
                    <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
                    <Text className="flex-1 text-left text-sm color-textSecondary">{emailErrors}</Text>
                  </View>
                )}

                <SubmitButton message="Siguiente" onPress={handleNextFromStep1} props={{ style: { marginTop: 10 } }} loading={loading} />

                <Text style={{ textAlign: 'center' }}>- o -</Text>

                <ActionButton iconName="person" message="Ya tengo cuenta" onPress={onNavigateToLogin} />
              </>
            ) : step === 2 ? (
              <>
                <CustomTextInput
                  ref={userNameInputRef}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Nombre de usuario"
                  keyboardType="default"
                  errors={userNameErrors}
                />

                {userNameErrors.length > 0 && (
                  <View className="flex flex-row items-center">
                    <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
                    <Text className="flex-1 text-left text-sm color-textSecondary">{userNameErrors}</Text>
                  </View>
                )}

                <SubmitButton message="Siguiente" onPress={handleNextFromStep2} props={{ style: { marginTop: 10 } }} loading={false} />
              </>
            ) : step === 3 ? (
              <>
                <CustomTextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Contraseña"
                  keyboardType="default"
                  secureTextEntry={true}
                  errors={passwordErrors}
                />

                <CustomTextInput
                  ref={confirmPasswordInputRef}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmar contraseña"
                  keyboardType="default"
                  secureTextEntry={true}
                  errors={confirmPasswordErrors}
                />

                {(passwordErrors.length > 0 || confirmPasswordErrors.length > 0) && (
                  <View className='flex flex-col items-center'>
                    {passwordErrors.length > 0 && (
                      <View className="flex flex-row items-center">
                        <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
                        <Text className="flex-1 text-left text-sm color-textSecondary">{passwordErrors}</Text>
                      </View>
                    )}
                    {confirmPasswordErrors.length > 0 && (
                      <View className="flex flex-row items-center">
                        <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8, marginTop: 4 }} />
                        <Text className="flex-1 text-left text-sm color-textSecondary">{confirmPasswordErrors}</Text>
                      </View>
                    )}
                  </View>
                )}

                <SubmitButton message="Siguiente" onPress={handleNextFromStep3} props={{ style: { marginTop: 10 } }} loading={false} />
              </>
            ) : step === 4 ? (
              <>
                {/* Selector de idioma */}
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
                    Idioma de preferencia
                  </Text>
                  <LanguageSelector
                    selectedLanguage={language}
                    onSelect={(lang) => setLanguage(lang as Language)}
                  />
                </View>

                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
                    Género 
                  </Text>
                  <GenderSelector
                    selectedGender={gender}
                    onSelect={(gen) => setGender(gen as Gender)}
                  />
                </View>

                <SubmitButton loading={loading} message="Siguiente" onPress={handleNextFromStep4} props={{ style: { marginTop: 16 } }} />
              </>
            ) : (
              <>
                <Text className="text-center text-regular color-textSecondary mb-6" style={{ fontSize: 15, lineHeight: 22 }}>
                  Hemos enviado un código de seguridad a{' '}
                  <Text style={{ fontWeight: '600', color: '#4054A1' }}>{email}</Text>.
                  Debería llegarte en unos minutos. Si no ves ningún email en tu inbox, comprueba tu carpeta de spam.
                </Text>

                <Text className="text-center text-regular color-textSecondary mb-4" style={{ fontSize: 14 }}>
                  Introduce el código abajo:
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                  {/* Primera pill - 3 dígitos */}
                  <View style={{ 
                    backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
                    borderRadius: 45,
                    borderWidth: 2,
                    borderColor: verificationCode1.length > 0 ? '#4054A1' : '#ccc',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    minWidth: 120,
                  }}>
                    <TextInput
                      ref={code1InputRef}
                      value={verificationCode1}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '').slice(0, 3);
                        setVerificationCode1(cleaned);
                        if (cleaned.length === 3) {
                          code2InputRef.current?.focus();
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={3}
                      style={{
                        fontSize: 24,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                        letterSpacing: 8,
                      }}
                      placeholder="000"
                      placeholderTextColor="#ccc"
                    />
                  </View>

                  {/* Segunda pill - 3 dígitos */}
                  <View style={{ 
                    backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
                    borderRadius: 45,
                    borderWidth: 2,
                    borderColor: verificationCode2.length > 0 ? '#4054A1' : '#ccc',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    minWidth: 120,
                  }}>
                    <TextInput
                      ref={code2InputRef}
                      value={verificationCode2}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '').slice(0, 3);
                        setVerificationCode2(cleaned);
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && verificationCode2.length === 0) {
                          code1InputRef.current?.focus();
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={3}
                      style={{
                        fontSize: 24,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                        letterSpacing: 8,
                      }}
                      placeholder="000"
                      placeholderTextColor="#ccc"
                    />
                  </View>
                </View>

                {verificationCodeErrors.length > 0 && (
                  <View className="flex flex-row items-center justify-center mb-4">
                    <svgIcons.UrgentIcon width={16} height={16} fill="gray" style={{ marginRight: 8 }} />
                    <Text className="text-center text-sm color-textSecondary">{verificationCodeErrors}</Text>
                  </View>
                )}

                <SubmitButton message="Crear cuenta" onPress={handleVerifyAndSignUp} props={{ style: { marginTop: 10 } }} loading={loading} />

                <TouchableOpacity onPress={handleResendCode} style={{ marginTop: 16, opacity: resendLoading ? 0.7 : 1 }} disabled={resendLoading}>
                  <Text style={{ textAlign: 'center', color: '#4054A1', fontSize: 14 }}>
                    {resendLoading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

          {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 12 }}>{error}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  </ScrollView>
  );
}