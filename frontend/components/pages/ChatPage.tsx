import { getLocale } from '@/app/i18n/i18n.config';
import { useChatContext } from '@/contexts/ChatContext';
import chatbotService from '@/utils/chatbotService';
import { Message, MessageOption, Role } from '@/utils/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, useColorScheme } from 'react-native';
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
  const { registerResetHandler, setActiveChatId } = useChatContext();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(() => `user_${Date.now()}`); 
  const [chatId, setChatId] = useState(() => `chat_${Date.now()}`);
  const [currentOptions, setCurrentOptions] = useState<MessageOption[][] | undefined>(undefined);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const db = useSQLiteContext();
  const listRef = useRef<StreamingMessageListRef>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  


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
  }, []);

  useEffect(() => {
    if (id){
      setActiveChatId(parseInt(id));
    }
  }, [id, setActiveChatId]);

  useEffect(() => {
    if (id) {
      getMessages(db, parseInt(id)).then((res) => {
        setMessages(res);
      });
    }
  }, [id, db]);

  useEffect(() => {
    registerResetHandler(resetChat);
  }, [registerResetHandler, resetChat]);

  useEffect(() => {
    checkBackendConnection();
    if (!chatInitialized) {
      handleOptionSelect('START');
      id = chatId.split('_')[1];
      changeChatTitle(db, parseInt(id), "Nuevo Chat");
    }
  }, [chatInitialized]);



  const checkBackendConnection = async () => {
    try {
      const isHealthy = await chatbotService.checkHealth();
      if (!isHealthy) {
        Alert.alert(
          'Conexión',
          'No se pudo conectar con el servidor del chatbot. Asegúrate de que el backend de Elixir esté ejecutándose.'
        );
      }
    } catch (error) {
      console.error('Error checking backend:', error);
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
      Promise.all([
        addMessage(db, parseInt(chatId.split('_')[1]), userMessage),
        addMessage(db, parseInt(chatId.split('_')[1]), headerMessage)
      ]).catch(console.error);
      
      if (callbackData === 'U1') { addChat(db, 'Nuevo Chat', parseInt(chatId.split('_')[1]), "urgent");}
      if (callbackData === 'I1') {addChat(db, 'Nuevo Chat', parseInt(chatId.split('_')[1]), "information");}
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
        addMessage(db, parseInt(chatId.split('_')[1]), botResponse);
        const cleanedContent = botResponse.content.replace(/\*/g, '').split('\n')[0];
        changeChatTitle(db, parseInt(chatId.split('_')[1]), cleanedContent.slice(0, 30) + '...');
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

    const entering = isLastAssistantMessage ? FadeIn.duration(500) : FadeIn.duration(300);

    let content = (
      <ChatMessage
        id={item.id}
        content={item.content}
        role={item.role}
        loading={loading}
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
    />
  )
}

export default IndexChatPage