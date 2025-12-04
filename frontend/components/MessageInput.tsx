import React from 'react';
import { Button, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';

import { MessageOption } from '@/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { BackButton } from './BackButton';

export type MessageInputProps = {
  options?: MessageOption[][];
  onOptionSelect: (callbackData: string) => void;
  chatInitialized: boolean;
}

const getDefaultOptions = (t: (key: string) => string): MessageOption[][] => [
  [{ text: t("chat.message.urgent"), callback_data: "urgent" }],
  [{ text: t("chat.message.info"), callback_data: "info" }]
];

const getFinishedOptions = (t: (key: string) => string): MessageOption[][] => [
];

const MessageInput = ({ options, onOptionSelect, chatInitialized }: MessageInputProps) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const hasBackOption = options?.some(row => row.some(opt => opt.callback_data === 'BACK'));

  const filteredOptions = options?.map(row => row.filter(opt => opt.callback_data !== 'BACK')).filter(row => row.length > 0);

  const displayOptions = (options && options.length > 0) 
    ? (filteredOptions || []) 
    : (chatInitialized ? getDefaultOptions(t) : getFinishedOptions(t));

  const flatOptions = displayOptions.flat();
  const totalOptions = flatOptions.length;



  return (
    <View className={`border ${colorScheme === 'dark' ? 'border-[#323234]' : 'border-[#E5E7EB]'} mx-5 ${colorScheme === 'dark' ? 'bg-[#161618]' : 'bg-[#D1E9FF]'} rounded-3xl p-5 mb-10 ${options?.length === 0 ? 'h-32' : ''}`} style={{ maxHeight: '50%'}}>
      
      {hasBackOption || options?.length === 0 && (
        <BackButton 
          className="absolute left-4 top-4 z-10" 
          onPress={() => onOptionSelect('BACK')} 
        />
      )}
      {options?.length !== 0 && (<Text className={`text-center font-bold text-[18px] mb-5 mt-5 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>{t("chat.querySuggestion")}</Text>)}
      
      <Ionicons className="absolute right-10 top-10" name="send" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />

      <ScrollView 
        className="mt-2" 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 8 }}
      >            
        {/* Caso 1: 2 o menos opciones */}
        {totalOptions <= 3 && flatOptions.map((option) => (
          <Pressable
            key={option.callback_data}
            onPress={() => onOptionSelect(option.callback_data)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']}
                className="relative flex flex-row items-center justify-center mt-2  border px-4 py-5 gap-3"
                style={{
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                  borderRadius: 20,
                  paddingVertical: 15,
                  marginBottom: 12,
                }}
              >
                <Text
                  className="text-center text-lg flex-1 font-semibold"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        ))}

        {/* Caso 2: Entre 2 y 4 opciones */}
        {totalOptions > 3 && totalOptions <= 5 && flatOptions.map((option) => (
          <Pressable
            key={option.callback_data}
            onPress={() => onOptionSelect(option.callback_data)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']}
                className="relative flex flex-row items-center justify-center mt-2  border px-4 py-5 gap-3"
                style={{
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                  borderRadius: 20,
                  paddingVertical: 15,
                  marginBottom: 12,
                }}
              >
                <Text
                  className="text-center text-lg flex-1 font-semibold"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        ))}

        {/* Caso 3: Más de 4 opciones */}
        {totalOptions > 5 && flatOptions.map((option) => (
          <Pressable
            key={option.callback_data}
            onPress={() => onOptionSelect(option.callback_data)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']}
                className="relative flex flex-row items-center justify-center mt-2  border px-4 py-2 gap-3"
                style={{
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                  borderRadius: 20,
                  paddingVertical: 15,
                  marginBottom: 12,
                }}
              >
                <Text
                  className="text-center text-lg flex-1 font-semibold"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export default MessageInput