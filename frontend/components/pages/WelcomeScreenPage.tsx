import { View, ScrollView, Image } from 'react-native'
import React from 'react'

import BubbleButton from '@/components/common/BubbleButton';
import MessageInput from '@/components/MessageInput';
import Text from '@/components/common/Text';

import { MessageOption } from '@/utils/interfaces';

import { LinearGradient } from 'expo-linear-gradient';
import { svgIcons } from '@/constants/icons';
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

    const gradientColors = colorScheme === 'dark'
        ? ['#0f172a', '#1e293b', '#334155', '#475569', '#0f172a']
        : ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#bfdbfe', '#ffffff'];

  return (
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View className="flex-1">
        <BubbleButton
          onPress={openDrawer}
          iconName="menu"
          additionalStyles="top-14 left-4 z-10"
        />

{/*         <ScreenSelector
          onPress={openDrawer}
          iconName="menu"
        /> */}

        <BubbleButton
          onPress={resetChat}
          additionalStyles="top-14 right-4 z-10"
          svgIcon={svgIcons.IncognitoIcon()}
        />
        <ScrollView>
          <View className="flex-1 justify-start items-center px-4 mt-32">
            <Image source={require('@/assets/images/ecos-logo.png')} alt="EcosBot Illustration" resizeMode="contain" className="w-40 h-40 mb-12 mt-12" />
            <Text style={{ fontFamily: 'Merriweather_400Regular', color: colorScheme === 'dark' ? 'white' : '#4054A1' }} className={`text-center text-[28px]`}>
              {t("chat.welcomeTile")}
            </Text>
            <Text className={`mt-5 px-5 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
              {t("chat.presentation")}
            </Text>
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
    </LinearGradient>
  )
}

export default WelcomeScreenPage