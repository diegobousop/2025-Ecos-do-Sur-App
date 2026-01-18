import ActionButton from '@/components/common/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import SubmitButton from '@/components/SubmitButton';
import { useAuth } from '@/contexts/AuthContext';
import chatbotService from '@/utils/chatbotService';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, useColorScheme, View } from 'react-native';



type Language = 'es' | 'gl' | 'en';
type Gender = 'male' | 'female' | 'other' | 'prefer_not_say';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { setSession, isSignedIn } = useAuth();
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState('diegoxDash');
  const [email, setEmail] = useState('diegoooo@gmail.com');
  const [password, setPassword] = useState('574465');
  const [language, setLanguage] = useState<Language>('es');
  const [gender, setGender] = useState<Gender | "">("");
  const [error, setError] = useState<string | null>(null);

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

  const validateStep1 = () => {
    if (!userName.trim()) {
      setError('El nombre de usuario es requerido');
      return false;
    }
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!password.trim()) {
      setError('La contraseña es requerida');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    setError(null);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try{
      const response = await chatbotService.register(userName.trim(), email.trim(), password.trim(), language, gender);
      if (!response.token) {
        return;
      }
      await setSession({
        token: response.token,
        user: response.user,
      }); 
    }catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }finally{
      setLoading (false);
          router.push('/(tabs)/(drawer)/(chat)/new');
    }
  }
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

  const StepIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4054A1',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>1</Text>
      </View>
      <View style={{
        width: 40,
        height: 2,
        backgroundColor: step === 2 ? '#4054A1' : '#ccc',
      }} />
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: step === 2 ? '#4054A1' : '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>2</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'flex-start', gap: 12, marginTop: 100 }}>
      <Image 
        source={require('@/assets/images/ecos-logo.png')} 
        alt="EcosBot Illustration" resizeMode="contain" 
        className="w-16 h-16 mb-2 self-center" 
      />
      
      <Text className="text-center font-sans" style={{ fontSize: 24 }}>Crear cuenta</Text>
      <Text className="text-center text-regular color-textSecondary mb-4">
        {step === 1 ? 'Introduce tus datos de acceso' : 'Personaliza tu experiencia'}
      </Text>

      <StepIndicator />

      {step === 1 ? (
        <>
          <CustomTextInput
            value={userName}
            onChangeText={setUserName}
            placeholder="Nombre de usuario"
            keyboardType="default"
          />

          <CustomTextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />

          <CustomTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            keyboardType="default"
            secureTextEntry={true}
          />

          <SubmitButton loading={false} message="Siguiente" onPress={handleNextStep} props={{ style: { marginTop: 16 } }} />

          <ActionButton iconName="person" message="Ya tengo cuenta" onPress={onNavigateToLogin} />
        </>
      ) : (
        <>
          {/* Botón para volver */}
          <TouchableOpacity 
            onPress={handlePreviousStep}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          >
            <Ionicons name="arrow-back" size={20} color="#4054A1" />
            <Text style={{ color: '#4054A1', marginLeft: 4 }}>Volver</Text>
          </TouchableOpacity>

          {/* Selector de idioma */}
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
              Idioma de preferencia
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {languages.map((lang) => (
                <SelectOption
                  key={lang.value}
                  selected={language === lang.value}
                  label={lang.label}
                  onPress={() => setLanguage(lang.value)}
                />
              ))}
            </View>
          </View>

          {/* Selector de sexo */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
              Género 
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
              {genders.map((g) => (
                <SelectOption
                  key={g.value}
                  selected={gender === g.value}
                  label={g.label}
                  onPress={() => setGender(g.value)}
                />
              ))}
            </View>
          </View>

          <SubmitButton loading={loading} message="Crear cuenta" onPress={handleSignUp} props={{ style: { marginTop: 16 } }} />
        </>
      )}

      {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
    </View>
  );
}