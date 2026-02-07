import Text from '@/components/common/Text';
import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import chatbotService from '@/utils/chatbotService';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Image, Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Step1EmailForm from '@/components/pages/register/Step1EmailForm';
import Step2UsernameForm from '@/components/pages/register/Step2UsernameForm';
import Step4PasswordForm from '@/components/pages/register/Step4PasswordForm';
import Step5ProfileForm from '@/components/pages/register/Step5ProfileForm';
import Step6VerificationForm from '@/components/pages/register/Step6VerificationForm';



type Language = 'es' | 'gl' | 'en';
type Gender = 'male' | 'female' | 'other' | 'prefer_not_say';

export default function Register() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const router = useRouter();
  const { setSession, isSignedIn } = useAuth();  
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
    try {
      const response = await chatbotService.register(userName.trim(), email.trim(), password.trim(), language, gender, '');
      if (!response.token) {
        setError('Error al crear la cuenta. Intenta de nuevo.');
        return;
      }
      await setSession({
        token: response.token,
        user: response.user,
      });
      router.push('/(tabs)/(drawer)/(chat)/new');
    } catch (error) {
      console.error('Error creating account:', error);
      setError('No pudimos crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }

    // CÓDIGO ORIGINAL (DESACTIVADO):
    // setLoading(true);
    // setVerificationCodeErrors('');
    // try {
    //   console.warn('Requesting signup code for:', email.trim());
    //   await chatbotService.requestSignUpCode(email.trim());
    //   setVerificationCode1('');
    //   setVerificationCode2('');
    //   setStep(5);
    // } catch (err: any) {
    //   if (err?.status === 409) {
    //     setEmailErrors('Este email ya está registrado');
    //     setStep(1);
    //   } else if (err?.status === 429) {
    //     setVerificationCodeErrors('Ya enviamos un código recientemente. Espera unos segundos e inténtalo de nuevo.');
    //     setStep(5);
    //   } else if (err?.status === 400) {
    //     setEmailErrors('Email inválido');
    //     setStep(1);
    //   } else {
    //     setVerificationCodeErrors('No pudimos enviar el código. Intenta de nuevo.');
    //   }
    // } finally {
    //   setLoading(false);
    // }
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

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Introduce tu email';
      case 2: return 'Nombre de usuario';
      case 3: return 'Crea tu contraseña';
      case 4: return 'Personaliza tu experiencia';
      case 5: return 'Verifica tu email';
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1EmailForm
            email={email}
            setEmail={setEmail}
            emailErrors={emailErrors}
            loading={loading}
            onNext={handleNextFromStep1}
            onNavigateToLogin={onNavigateToLogin}
          />
        );
      case 2:
        return (
          <Step2UsernameForm
            userName={userName}
            setUserName={setUserName}
            userNameErrors={userNameErrors}
            loading={loading}
            onNext={handleNextFromStep2}
          />
        );
      case 3:
        return (
          <Step4PasswordForm
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordErrors={passwordErrors}
            confirmPasswordErrors={confirmPasswordErrors}
            loading={loading}
            onNext={handleNextFromStep3}
          />
        );
      case 4:
        return (
          <Step5ProfileForm
            language={language}
            setLanguage={setLanguage}
            gender={gender}
            setGender={setGender}
            loading={loading}
            onNext={handleNextFromStep4}
          />
        );
      case 5:
        return (
          <Step6VerificationForm
            email={email}
            verificationCode1={verificationCode1}
            setVerificationCode1={setVerificationCode1}
            verificationCode2={verificationCode2}
            setVerificationCode2={setVerificationCode2}
            verificationCodeErrors={verificationCodeErrors}
            loading={loading}
            resendLoading={resendLoading}
            onVerify={handleVerifyAndSignUp}
            onResend={handleResendCode}
          />
        );
    }
  };

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
              {getStepTitle()}
            </Text>

            {renderStep()}

          {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 12 }}>{error}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  </ScrollView>
  );
}