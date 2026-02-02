import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useRef } from 'react';
import { TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Step5VerificationFormProps {
  email: string;
  verificationCode1: string;
  setVerificationCode1: (code: string) => void;
  verificationCode2: string;
  setVerificationCode2: (code: string) => void;
  verificationCodeErrors: string;
  loading: boolean;
  resendLoading: boolean;
  onVerify: () => void;
  onResend: () => void;
}

export default function Step5VerificationForm({
  email,
  verificationCode1,
  setVerificationCode1,
  verificationCode2,
  setVerificationCode2,
  verificationCodeErrors,
  loading,
  resendLoading,
  onVerify,
  onResend,
}: Step5VerificationFormProps) {
  const colorScheme = useColorScheme();
  const code1InputRef = useRef<TextInput>(null);
  const code2InputRef = useRef<TextInput>(null);

  return (
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

      <SubmitButton message="Crear cuenta" onPress={onVerify} props={{ style: { marginTop: 10 } }} loading={loading} />

      <TouchableOpacity onPress={onResend} style={{ marginTop: 16, opacity: resendLoading ? 0.7 : 1 }} disabled={resendLoading}>
        <Text style={{ textAlign: 'center', color: '#4054A1', fontSize: 14 }}>
          {resendLoading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
        </Text>
      </TouchableOpacity>
    </>
  );
}
