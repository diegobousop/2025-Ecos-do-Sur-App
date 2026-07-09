import React, { useMemo, useRef, useState } from 'react';
import { Animated, Image, ScrollView, View } from 'react-native';

import BubbleButton from '@/components/common/BubbleButton';
import Text from '@/components/common/Text';
import MessageInput from '@/components/MessageInput';

import { MessageOption } from '@/utils/interfaces';

import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import ScreenSelector from '../common/ScreenSelector';

interface WelcomeScreenPageProps {
  openDrawer: () => void;
  resetChat: () => void;
  currentOptions: MessageOption[][] | undefined;
  handleOptionSelect: (option: string) => void;
  chatInitialized: boolean;
  firstLoad: boolean;
  colorScheme: 'light' | 'dark';
  t: (key: string) => string;
  selectedScreen: 'chat' | 'feed';
}

const WelcomeScreenPage = ({
  openDrawer,
  resetChat,
  currentOptions,
  handleOptionSelect,
  chatInitialized,
  firstLoad,
  colorScheme,
  t,
  selectedScreen
}: WelcomeScreenPageProps) => {

    const { toggleIncognito, getIsIncognito } = useChatContext();
    const { user } = useAuth();
    const { t: tt, i18n } = useTranslation();
    const [isIncognito, setIsIncognito] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Saludo de bienvenida: personalizado con el nombre si hay sesión, elegido
    // al azar de una pool general + una pool según la hora del día.
    const welcomeMessage = useMemo(() => {
      // Primer nombre, con la inicial en mayúscula (ej. "diego" -> " Diego").
      const rawName = (user?.name || user?.userName || '').trim().split(' ')[0];
      const firstName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : '';
      const namePart = firstName ? ` ${firstName}` : '';

      // Pool según la franja horaria.
      const hour = new Date().getHours();
      const timeKey =
        hour >= 5 && hour < 14
          ? 'chat.welcome.morning'
          : hour >= 14 && hour < 21
          ? 'chat.welcome.afternoon'
          : 'chat.welcome.night';

      const anytime = tt('chat.welcome.anytime', { returnObjects: true });
      const timed = tt(timeKey, { returnObjects: true });
      const pool = [
        ...(Array.isArray(anytime) ? anytime : []),
        ...(Array.isArray(timed) ? timed : []),
      ] as string[];

      const template = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : '¡Hola{{name}}!';

      return template.replace('{{name}}', namePart) + tt('chat.welcome.suffix');
      // Se recalcula si cambia el usuario o el idioma (no en cada render).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.name, user?.userName, i18n.language]);

    const handleToggleIncognito = () => {
      toggleIncognito();
      const newIncognitoState = getIsIncognito();
      
      // Animación de fade para transición suave
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIsIncognito(newIncognitoState);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    };

    const normalGradientColors = colorScheme === 'dark'
      ? ['#000000', '#000000']
      : ['#ffffff', '#ffffff'];
    
    const incognitoGradientColors = ['#ffffff', '#ffffff'];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient 
        colors={normalGradientColors} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 0, y: 1 }} 
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      <Animated.View style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%',
        opacity: isIncognito ? fadeAnim : 0 
      }}>
        <LinearGradient 
          colors={incognitoGradientColors} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 0, y: 1 }} 
          style={{ flex: 1 }}
        />
      </Animated.View>
      <View className="flex-1">
        <BubbleButton
          onPress={openDrawer}
          iconName="menu"
          additionalStyles="top-14 right-4 z-10"
        />

        <ScreenSelector selectedScreen={selectedScreen} />

        <BubbleButton
          onPress={handleToggleIncognito}
          additionalStyles="top-14 left-4 z-10"
          svgIcon= {isIncognito ? svgIcons.IncognitoIcon() : svgIcons.IncognitoIconOutline()}
        />
        <ScrollView>
          <View className="flex-1 justify-start items-center px-4 mt-64">            
            <Text
              style={{ fontFamily: 'Merriweather_400Regular', color: colorScheme === 'dark' ? 'white' : '#4054A1' }}
              className={`text-center text-[28px]`}>
              {welcomeMessage}
            </Text>
            <Animated.Text 
              style={{ opacity: fadeAnim }} 
              className={`text-[16px] font-sans mt-5 px-5 text-center ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              {isIncognito ? t("chat.incognitoPresentation") : t("chat.presentation")}
            </Animated.Text>
          </View>
        </ScrollView>
        <MessageInput
          options={currentOptions}
          onOptionSelect={handleOptionSelect}
          chatInitialized={chatInitialized}
          firstLoad={firstLoad}
          query={true}
        />
      </View>
    </View>
  )
}

export default WelcomeScreenPage