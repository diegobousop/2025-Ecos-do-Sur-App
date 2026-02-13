import React, { useRef, useState } from 'react';
import { Animated, Image, ScrollView, View } from 'react-native';

import BubbleButton from '@/components/common/BubbleButton';
import Text from '@/components/common/Text';
import MessageInput from '@/components/MessageInput';

import { MessageOption } from '@/utils/interfaces';

import { svgIcons } from '@/constants/icons';
import { useChatContext } from '@/contexts/ChatContext';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeScreenPageProps {
  openDrawer: () => void;
  resetChat: () => void;
  currentOptions: MessageOption[][] | undefined;
  handleOptionSelect: (option: string) => void;
  chatInitialized: boolean;
  firstLoad: boolean;
  colorScheme: 'light' | 'dark';
  t: (key: string) => string;
}

const WelcomeScreenPage = ({
  openDrawer,
  resetChat,
  currentOptions,
  handleOptionSelect,
  chatInitialized,
  firstLoad,
  colorScheme,
  t
}: WelcomeScreenPageProps) => {

    const { toggleIncognito, getIsIncognito } = useChatContext();
    const [isIncognito, setIsIncognito] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

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

        <BubbleButton
          onPress={handleToggleIncognito}
          additionalStyles="top-14 left-4 z-10"
          svgIcon= {isIncognito ? svgIcons.IncognitoIcon() : svgIcons.IncognitoIconOutline()}
        />

        {/* <BubbleButton
          onPress={openDrawer}
          iconName="menu"
          additionalStyles="top-14 left-4 z-10"
        />

        <BubbleButton
          onPress={handleToggleIncognito}
          additionalStyles="top-14 right-4 z-10"
          svgIcon= {isIncognito ? svgIcons.IncognitoIcon() : svgIcons.IncognitoIconOutline()}
        /> */}
        <ScrollView>
          <View className="flex-1 justify-start items-center px-4 mt-64">
            {/* <Image source={require('@/assets/images/ecos-logo.png')} alt="EcosBot Illustration" resizeMode="contain" className="w-40 h-40 mb-12 mt-12" /> */}
            <Text style={{ fontFamily: 'Merriweather_400Regular', color: colorScheme === 'dark' ? 'white' : '#4054A1' }} className={`text-center text-[28px]`}>
              {t("chat.welcomeTile")}
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