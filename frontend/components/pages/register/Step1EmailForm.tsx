import ActionButton from '@/components/common/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';


interface Step1EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  emailErrors: string;
  loading: boolean;
  onNext: () => void;
  onNavigateToLogin: () => void;
}

export default function Step1EmailForm({
  email,
  setEmail,
  emailErrors,
  loading,
  onNext,
  onNavigateToLogin,
}: Step1EmailFormProps) {
  const emailInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
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

      <SubmitButton message="Siguiente" onPress={onNext} props={{ style: { marginTop: 10 } }} loading={loading} />

      <Text style={{ textAlign: 'center' }}>- o -</Text>

      <ActionButton iconName="person" message="Ya tengo cuenta" onPress={onNavigateToLogin} />
    </>
  );
}
