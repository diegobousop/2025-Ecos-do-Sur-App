import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export type MessageInputProps = {
    onShouldSendMessage: (message: string) => void;
}

const MessageInput = () => {
  const {t} = useTranslation();
  const [message, setMessage] = useState("")
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);

    const handlePress = (type: 'urgent' | 'info') => {
    };

  return (
    <View className="border border-[#E5E7EB] bg-[#D1E9FF] rounded-2xl p-5 m-5 mb-10">
      <Text className="text-center font-bold text-lg">{t("chat.querySuggestion")}</Text>
      <Ionicons className="absolute right-4 top-4" name="send" size={24} color="black"  />

      {/* Urgente */}
      <Pressable onPress={() => handlePress('urgent')}>
        {({ pressed }) => (
          <View
            className="relative flex flex-row items-center justify-center mt-4 rounded-full border px-4 py-5 gap-5"
            style={{
              backgroundColor: pressed ? '#FEF2F2' : '#FFFFFF',   // rojo claro al mantener pulsado
              borderColor: pressed ? '#F87171' : '#E5E7EB',
            }}
          >
            <Ionicons name="alert-circle-outline" size={24} color={pressed ? '#DC2626' : 'black'} />
            <Text
              className="text-center text-xl"
              style={{ color: pressed ? '#B91C1C' : '#000000' }}
            >
              {t("chat.message.urgent")}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Información */}
      <Pressable onPress={() => handlePress('info')}>
        {({ pressed }) => (
          <View
            className="relative flex flex-row items-center justify-center mt-4 rounded-full border px-4 py-5 gap-5"
            style={{
              backgroundColor: pressed ? '#EFF6FF' : '#FFFFFF',   // azul claro al mantener pulsado
              borderColor: pressed ? '#60A5FA' : '#E5E7EB',
            }}
          >
            <Ionicons name="information-circle-outline" size={24} color={pressed ? '#2563EB' : 'black'} />
            <Text
              className="text-center text-xl"
              style={{ color: pressed ? '#1D4ED8' : '#000000' }}
            >
              {t("chat.message.info")}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  )
}

export default MessageInput