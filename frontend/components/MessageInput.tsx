import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { MessageOption } from '@/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export type MessageInputProps = {
  options?: MessageOption[][];
  onOptionSelect: (callbackData: string) => void;
}

// Opciones por defecto cuando no hay opciones del backend
const getDefaultOptions = (t: (key: string) => string): MessageOption[][] => [
  [{ text: t("chat.message.urgent"), callback_data: "urgent" }],
  [{ text: t("chat.message.info"), callback_data: "info" }]
];

const MessageInput = ({ options, onOptionSelect }: MessageInputProps) => {
  const { t } = useTranslation();

  // Usar opciones del backend o las predeterminadas
  const displayOptions = options && options.length > 0 ? options : getDefaultOptions(t);

  return (
    <View className="border border-[#E5E7EB] bg-[#D1E9FF] rounded-2xl p-5 m-5 mb-10" style={{ maxHeight: '50%' }}>
      <Text className="text-center font-bold text-lg">{t("chat.querySuggestion")}</Text>
      <Ionicons className="absolute right-4 top-4" name="send" size={24} color="black" />

      <ScrollView 
        className="mt-2" 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {displayOptions.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} className="flex flex-col gap-2">
            {row.map((option) => (
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
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default MessageInput