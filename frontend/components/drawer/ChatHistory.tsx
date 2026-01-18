import { deleteDatabase, createDatabase } from '@/utils/database';
import { Chat } from '@/utils/interfaces';
import { useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from '../common/Text';

import { svgIcons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ChatHistoryProps {
  onSelectChat: (chatId: number) => void;
  activeChatId: number | null;
  history: Chat[];
  loadChats: () => Promise<void>;
}

const ChatHistory = ({ onSelectChat, activeChatId, history, loadChats }: ChatHistoryProps) => {
  const { t } = useTranslation();
  const db = useSQLiteContext();
  const [hideChats, setHideChats] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(hideChats ? '-90deg' : '0deg', { duration: 300 }) }],
  }));

  const formatDate = (dateInput?: string | number | null) => {
    if (dateInput == null || dateInput === '') return '';
    const date = typeof dateInput === 'number' ? new Date(dateInput) : new Date(String(dateInput));
    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
      });
    }

    if (diffMs < 60 * 1000) return 'Ahora';

    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfThatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const diffDays = Math.floor((startOfToday - startOfThatDay) / (24 * 60 * 60 * 1000));

    if (diffDays === 1) return 'Ayer';
    if (diffDays >= 2 && diffDays <= 6) {
      return date.toLocaleDateString('es-ES', { weekday: 'long' });
    }

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <View className="p-5">
        <Text className="text-black text-center font-sans-semibold">{t('drawer.no_conversations')}</Text>
      </View>
    );
  }

  return (
    <View className="p-5">
      <View className="flex flex-row justify-between items-center px-6 mb-8">
        <Text
          style={{
            fontFamily: 'Merriweather_700Bold',
            color: '#919191',
            fontSize: 16,
          }}>Conversaciones</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(t('drawer.delete_title'), t('drawer.delete_message'), [
            {
              text: t('common.cancel'),
              style: 'cancel',
            },
            {
              text: t('common.delete'),
              style: 'destructive',
              onPress: async () => {
                await deleteDatabase(db);
                await createDatabase(db);
                await loadChats();
              }
            }
          ]);
        }}>      
          <Ionicons name="trash" size={16} color="#919191" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => {
          setHideChats(!hideChats);
        }}>
          <Animated.View style={animatedStyle}>
            <svgIcons.ArrowIcon width={16} height={16} color="#919191" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      {!hideChats && history.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          onPress={() => {
            onSelectChat(chat.id);
          }}
          className={`mb-4 p-2 rounded-[25px] ${chat.id === activeChatId ? 'bg-[#DCF0FF]' : 'bg-white'}`}
        >
          <View className="flex flex-row items-center gap-3">
            {chat.type === 'urgent' && (
              <svgIcons.UrgentIcon width={20} height={20}  />
            )}
            {chat.type === 'information' && (
              <svgIcons.InformationIcon width={20} height={20}  />
            )}
            <View className="flex flex-col ml-1">
              <Text className="text-lg font-semibold">{chat.title}</Text>
              <Text className="text-sm text-gray-600 mt-1">{formatDate(chat.createdAt ?? chat.updatedAt)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ChatHistory;