import CustomTextInput from '@/components/common/CustomTextInput';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { svgIcons } from '@/constants/icons';
import { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';


interface Step2UsernameFormProps {
  userName: string;
  setUserName: (userName: string) => void;
  userNameErrors: string;
  loading: boolean;
  onNext: () => void;
}

export default function Step2UsernameForm({
  userName,
  setUserName,
  userNameErrors,
  loading,
  onNext,
}: Step2UsernameFormProps) {
  const userNameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      userNameInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
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

      <SubmitButton message="Siguiente" onPress={onNext} props={{ style: { marginTop: 10 } }} loading={loading} />
    </>
  );
}
