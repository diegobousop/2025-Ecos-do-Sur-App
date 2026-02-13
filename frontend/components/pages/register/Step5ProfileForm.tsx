import GenderSelector from '@/components/common/GenderSelector';
import LanguageSelector from '@/components/common/LanguageSelector';
import Text from '@/components/common/Text';
import SubmitButton from '@/components/SubmitButton';
import { View } from 'react-native';

type Language = 'es' | 'gal' | 'en';
type Gender = 'male' | 'female' | 'other' | 'prefer_not_say';

interface Step4ProfileFormProps {
  language: Language;
  setLanguage: (language: Language) => void;
  gender: Gender | "";
  setGender: (gender: Gender | "") => void;
  loading: boolean;
  onNext: () => void;
}

export default function Step4ProfileForm({
  language,
  setLanguage,
  gender,
  setGender,
  loading,
  onNext,
}: Step4ProfileFormProps) {
  return (
    <>
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

      <SubmitButton loading={loading} message="Siguiente" onPress={onNext} props={{ style: { marginTop: 16 } }} />
    </>
  );
}
