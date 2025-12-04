import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { MessageOption } from '@/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BackButton } from './BackButton';

export type MessageInputProps = {
  options?: MessageOption[][];
  onOptionSelect: (callbackData: string) => void;
  chatInitialized: boolean;
}

// Opciones por defecto cuando no hay opciones del backend
const getDefaultOptions = (t: (key: string) => string): MessageOption[][] => [
  [{ text: t("chat.message.urgent"), callback_data: "urgent" }],
  [{ text: t("chat.message.info"), callback_data: "info" }]
];

const getFinishedOptions = (t: (key: string) => string): MessageOption[][] => [
];

const MessageInput = ({ options, onOptionSelect, chatInitialized }: MessageInputProps) => {
  const { t } = useTranslation();

  // Usar opciones del backend o las predeterminadas
  const displayOptions = options && options.length > 0 ? options : (chatInitialized ? getDefaultOptions(t) : getFinishedOptions(t));

  const flatOptions = displayOptions.flat();
  const totalOptions = flatOptions.length;

  return (
    <View className=" border border-[#E5E7EB] bg-[#D1E9FF] rounded-3xl p-5 m-5 mb-10" style={{ maxHeight: '50%', backgroundColor: 'rgba(209, 233, 255, 0.98)' }}>
      
      <BackButton />
      <Text className="text-center font-bold text-[16px] mb-5 mt-5">{t("chat.querySuggestion")}</Text>
      
      <Ionicons className="absolute right-14 top-10" name="send" size={24} color="black" />

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
              <View
                className="relative flex flex-row items-center justify-center mt-2 rounded-full border px-4 py-5 gap-3"
                style={{
                  backgroundColor: pressed ? '#EFF6FF' : '#FFFFFF',
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color={pressed ? '#2563EB' : 'black'}
                />
                <Text
                  className="text-center text-lg flex-1"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </View>
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
              <View
                className="relative flex flex-row items-center justify-center mt-2 rounded-full border px-4 py-5 gap-3"
                style={{
                  backgroundColor: pressed ? '#EFF6FF' : '#FFFFFF',
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color={pressed ? '#2563EB' : 'black'}
                />
                <Text
                  className="text-center text-lg flex-1"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export default MessageInput