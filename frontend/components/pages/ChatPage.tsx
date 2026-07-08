import { getLocale } from '@/app/i18n/i18n.config';
import { useAuth } from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import chatbotService from '@/utils/chatbotService';
import { Message, MessageOption, Role } from '@/utils/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, useColorScheme, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import ChatMessage from '@/components/ChatMessage';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AnchorItem, StreamingItem, StreamingMessageListRef } from 'react-native-streaming-message-list'; // Añadir StreamingMessageListProvider

import { addChat, addMessage, changeChatTitle, getMessages } from '@/utils/database';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import WelcomeScreenPage from './WelcomeScreenPage';

import MessageListPage from './MessageListPage';




const IndexChatPage = () => {
  let { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme()
  const { t } = useTranslation();
  const { registerResetHandler, setActiveChatId, getIsIncognito, setIsIncognito } = useChatContext();
  const { token, user } = useAuth();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(() => `user_${Date.now()}`); 
  const [chatId, setChatId] = useState(() => `chat_${Date.now()}`);
  const [currentOptions, setCurrentOptions] = useState<MessageOption[][] | undefined>(undefined);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;
  const listRef = useRef<StreamingMessageListRef>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<'chat' | 'feed'>('chat');

  // Contador para generar IDs únicos
  const messageIdCounter = useRef(0);
  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
  };

  // Función para resetear el chat
  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentOptions(undefined);
    setUserId(`user_${Date.now()}`);
    setChatId(`chat_${Date.now()}`);
    setLoading(false);
    setChatInitialized(false);
    setIsIncognito(false);
  }, [setIsIncognito]);

  useEffect(() => {
    if (id){
      setActiveChatId(parseInt(id));
    }
  }, [id, setActiveChatId]);

  useEffect(() => {
    if (id && db) {
      setLoadingMessages(true);
      getMessages(db, parseInt(id)).then((res) => {
        setMessages(res);
      }).finally(() => {
        setLoadingMessages(false);
      });
    }
  }, [id, db]);

  useEffect(() => {
    registerResetHandler(resetChat);
  }, [registerResetHandler, resetChat]);

  useEffect(() => {
    if (!chatInitialized) {
      handleOptionSelect('START');
    }
  }, [chatInitialized]);


  const handleChatSave = async (callbackData: string, chatIdNum: number) => {
    const isIncognito = getIsIncognito();
    
    if (isIncognito) {return;}
    
    const currentUserId = user?.id || null;
    
    if (callbackData === 'U1' && db) {
      addChat(db, 'Nuevo Chat', chatIdNum, "urgent", currentUserId);
      if (token) {
        //userService.saveChat(chatIdNum, 'urgent', token).catch(console.error);
      }
    }
    
    if (callbackData === 'I1' && db) {
      addChat(db, 'Nuevo Chat', chatIdNum, "information", currentUserId);
      if (token) {
        //userService.saveChat(chatIdNum, 'information', token).catch(console.error);
      }
    }
  };

  const handleOptionSelect = async (callbackData: string) => {
    if (loading && !chatInitialized) {
      setFirstLoad(true);
    } else {
      setFirstLoad(false);
    }

    if (loading) return;
    const userMessage: Message = {
      id: generateUniqueId(),
      role: Role.User,
      content: callbackData
    };

    if (chatInitialized) {
      setMessages(prev => [...prev, userMessage]);
      const headerMessage: Message = {
        id: generateUniqueId(),
        role: Role.BotHeader,
        content: "Cargando..."
      };
      setMessages(prev => [...prev, headerMessage]);
      const isIncognito = getIsIncognito();
      if (!isIncognito && db){
      Promise.all([
        addMessage(db, parseInt(chatId.split('_')[1]), userMessage),
        addMessage(db, parseInt(chatId.split('_')[1]), headerMessage)
      ]).catch(console.error);
    }
      handleChatSave(callbackData, parseInt(chatId.split('_')[1]));
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    try {
      let botResponse;
      if (!chatInitialized) {
        botResponse = await chatbotService.sendMessage({
          message: callbackData,
          user_id: userId,
          type: 'text',
          language_code: getLocale()
        });
      } else {
        botResponse = await chatbotService.sendCallback({
          data: callbackData,
          user_id: userId,
          language_code: getLocale()
        });
      }
      setCurrentOptions(botResponse.options);
      setChatInitialized(true);

      if (chatInitialized) {
        setMessages(prev => [...prev, botResponse]);
        if (db) {
          addMessage(db, parseInt(chatId.split('_')[1]), botResponse);
          const cleanedContent = botResponse.content.replace(/\*/g, '').split('\n')[0];
          changeChatTitle(db, parseInt(chatId.split('_')[1]), cleanedContent.slice(0, 30) + '...');
        }
      }

    } catch (error) {
        const errorMessage: Message = {
          id: generateUniqueId(),
          role: Role.Bot,
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
        };
        setMessages(prev => [...prev, errorMessage]);

        Alert.alert(
          'Error',
          'No se pudo enviar el mensaje. Verifica tu conexión con el servidor.'
        );
    } finally {
        setLoading(false);
        setFirstLoad(false);
      }
  };


  const renderMessage = ({ item }: { item: Message; index: number }) => {
    const isLastUserMessage = item.role === Role.User && item.id === messages.slice().reverse().find(m => m.role === Role.User)?.id;
    const isLastAssistantMessage = item.role === Role.Bot && item.id === messages.slice().reverse().find(m => m.role === Role.Bot)?.id;
    const isLastBotHeader = item.role === Role.BotHeader && item.id === messages.slice().reverse().find(m => m.role === Role.BotHeader)?.id;

    const entering = isLastAssistantMessage ? FadeIn.duration(500) : FadeIn.duration(300);

    let content = (
      <ChatMessage
        id={item.id}
        content={item.content}
        role={item.role}
        loading={loading}
        isLastBotHeader={isLastBotHeader}
      />
    );
    if (isLastUserMessage) {
      content = <AnchorItem>{content}</AnchorItem>;
    } else if (isLastAssistantMessage) {
      content = <StreamingItem>{content}</StreamingItem>;
    }

    return <Animated.View entering={entering}>{content}</Animated.View>;
  };

  const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }

  if (loadingMessages) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F5F5]">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (messages.length !== 0 && chatInitialized) {
    return (
      <MessageListPage
        resetChat={resetChat}
        currentOptions={currentOptions}
        handleOptionSelect={handleOptionSelect}
        chatInitialized={chatInitialized}
        messages={messages}
        renderMessage={renderMessage}
        loading={loading}
        id={id}
        listRef={listRef}
        showScrollButton={showScrollButton}
        setShowScrollButton={setShowScrollButton}
      />
    )
  }

  return (
    <WelcomeScreenPage
      openDrawer={openDrawer}
      resetChat={resetChat}
      currentOptions={currentOptions}
      handleOptionSelect={handleOptionSelect}
      chatInitialized={chatInitialized}
      firstLoad={firstLoad}
      colorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
      t={t}
      selectedScreen={selectedScreen}
    />
  )
}

export default IndexChatPage