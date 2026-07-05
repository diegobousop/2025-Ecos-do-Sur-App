import { svgIcons } from '@/constants/icons';
import { deleteChat, togglePinChat } from '@/utils/database';
import { Chat } from '@/utils/interfaces';
import { useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, TouchableOpacity, View, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from '../common/Text';

interface ChatHistoryProps {
  onSelectChat: (chatId: number) => void;
  activeChatId: number | null;
  history: Chat[];
  loadChats: () => Promise<void>;
}

const ChatHistory = ({ onSelectChat, activeChatId, history, loadChats }: ChatHistoryProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [hideChats, setHideChats] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [selectedChatId, setSelectedChatId] = React.useState<number | null>(null);
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(hideChats ? '-90deg' : '0deg', { duration: 300 }) }],
  }));

  const handleLongPress = (chatId: number) => {
    setSelectedChatId(chatId);
    setMenuVisible(true);
  };

  const handleDelete = async () => {
    if (selectedChatId !== null && db) {
      try {
        await deleteChat(db, selectedChatId);
        await loadChats();
      } catch (error) {
        console.error('Error al eliminar conversación:', error);
      }
    }
    setMenuVisible(false);
  };

  const handleTogglePin = async () => {
    if (selectedChatId !== null && db) {
      try {
        const selectedChat = history.find(chat => chat.id === selectedChatId);
        const newFixedState = !selectedChat?.isFixed;
        await togglePinChat(db, selectedChatId, newFixedState);
        await loadChats();
      } catch (error) {
        console.error('Error al fijar/desfijar conversación:', error);
      }
    }
    setMenuVisible(false);
  };

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
        <Text className={`text-center font-sans-semibold ${colorScheme === 'dark' ? 'text-gray-300' : 'text-black'}`}>{t('drawer.no_conversations')}</Text>
      </View>
    );
  }

  return (
    <View className="p-5 pt-0">
      <View className="flex flex-row justify-between items-center px-6 mb-8">
        <Text
          style={{
            fontFamily: 'Merriweather_700Bold',
            color: colorScheme === 'dark' ? '#9CA3AF' : '#919191',
            fontSize: 16,
          }}>Conversaciones</Text>
       
        <TouchableOpacity onPress={() => {
          setHideChats(!hideChats);
        }}>
          <Animated.View style={animatedStyle}>
            <svgIcons.ArrowIcon width={16} height={16} color={colorScheme === 'dark' ? '#9CA3AF' : '#919191'} />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      {!hideChats && history.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          onPress={() => {
            onSelectChat(chat.id);
          }}
          onLongPress={() => handleLongPress(chat.id)}
          className={`mb-4 p-2 rounded-[25px] ${
            chat.id === activeChatId 
              ? colorScheme === 'dark' ? 'bg-blue-900/40' : 'bg-[#DCF0FF]'
              : colorScheme === 'dark' ? 'bg-transparent' : 'bg-white'
          }`}
        >
          <View className="flex flex-row items-center gap-3 flex-1">
            {chat.type === 'urgent' && (
              <svgIcons.UrgentIcon width={20} height={20}  />
            )}
            {chat.type === 'information' && (
              <svgIcons.InformationIcon width={20} height={20}  />
            )}
            <View className="flex flex-col ml-1 flex-1">
              <Text className={`text-lg font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>{chat.title}</Text>
              <Text className={`text-sm mt-1 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(chat.createdAt ?? chat.updatedAt)}</Text>
            </View>
            {chat.isFixed && (
              <View className="mr-2">
                <svgIcons.PinIcon width={18} height={18} color={colorScheme === 'dark' ? '#9CA3AF' : '#9E9E9E'} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setMenuVisible(false)}
        >
          <View className={`${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-[80%] overflow-hidden`}>
      
            <TouchableOpacity
              onPress={handleTogglePin}
              className="flex-row items-center p-4 py-6"
            >
              <svgIcons.PinIcon width={25} height={25} color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
              <Text className="ml-5 text-base">
                {history.find(chat => chat.id === selectedChatId)?.isFixed ? 'Desfijar conversación' : 'Fijar conversación'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center p-4 py-6"
            >
              <svgIcons.TrashIcon width={25} height={25} color="#FF0000" />
              <Text className="ml-5 text-base text-red-500">Eliminar conversación</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ChatHistory;