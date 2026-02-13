import CustomTextInput from '@/components/common/CustomTextInput';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';


interface Step3PasswordFormProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  passwordErrors: string;
  confirmPasswordErrors: string;
  loading: boolean;
  onNext: () => void;
}

export default function Step3PasswordForm({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordErrors,
  confirmPasswordErrors,
  loading,
  onNext,
}: Step3PasswordFormProps) {
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
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

      <SubmitButton message="Siguiente" onPress={onNext} props={{ style: { marginTop: 10 } }} loading={loading} />
    </>
  );
}
