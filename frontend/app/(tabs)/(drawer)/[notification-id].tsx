import BubbleButton from '@/components/common/BubbleButton';
import ScreenSelector from '@/components/common/ScreenSelector';
import Text from '@/components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Linking, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';


const asString = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
};

const formatDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleDateString();
};

const NotificationDetail = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();

  const titulo = asString(params.titulo);
  const fecha = asString(params.fecha);
  const cuerpo = asString(params.cuerpo);
  const enlaceExterno = asString(params.enlace_externo);
  const urlImagen = asString(params.url_imagen);

  const navigation = useNavigation();
  const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }
  

  const goBack = () => {
    router.replace('/(tabs)/(drawer)/feed');
  };

  const openExternalLink = () => {
    if (enlaceExterno) {
      Linking.openURL(enlaceExterno).catch((error) =>
        console.error('Error opening external link:', error)
      );
    }
  };

  const dateLabel = formatDate(fecha);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
      <BubbleButton
        iconName="arrow-back"
        additionalStyles="top-14 left-4 z-10"
        onPress={goBack}
      />

      <BubbleButton
          iconName="menu"
          additionalStyles="top-14 right-4 z-10"
          onPress={openDrawer}
        />

        <ScreenSelector selectedScreen="feed" />

      <ScrollView contentContainerStyle={{ paddingTop: 120, paddingBottom: 60, paddingHorizontal: 20 }}>
        {urlImagen ? (
          <Image
            source={{ uri: urlImagen }}
            className="w-full h-56 rounded-2xl mb-4"
            resizeMode="cover"
          />
        ) : null}

        <Text
          style={{ fontFamily: 'Merriweather_400Regular', color: isDark ? 'white' : 'black' }}
          className="text-[26px]"
        >
          {titulo}
        </Text>

        {dateLabel ? (
          <Text className={`text-[13px] mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {dateLabel}
          </Text>
        ) : null}

        {cuerpo ? (
          <Text className={`text-[16px] mt-4 leading-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {cuerpo}
          </Text>
        ) : null}

        {enlaceExterno ? (
          <TouchableOpacity
            onPress={openExternalLink}
            className="flex-row items-center mt-6 bg-[#4054A1] px-5 py-3 rounded-full self-start"
          >
            <Ionicons name="open-outline" size={18} color="white" />
            <Text className="text-white font-medium ml-2">Ver más</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default NotificationDetail;
