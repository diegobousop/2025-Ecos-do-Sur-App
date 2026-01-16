import { getLocale } from '@/app/i18n/i18n.config';
import ChatMessage from '@/components/ChatMessage';
import Text from '@/components/common/Text';
import MessageInput from '@/components/MessageInput';
import { useChatContext } from '@/contexts/ChatContext';
import chatbotService from '@/utils/chatbotService';
import { Message, MessageOption, Role } from '@/utils/interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, useColorScheme, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { svgIcons } from '@/constants/icons';

import BubbleButton from '@/components/common/BubbleButton';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AnchorItem, StreamingItem, StreamingMessageList, StreamingMessageListProvider } from 'react-native-streaming-message-list'; // Añadir StreamingMessageListProvider



const IndexChatPage = () => {
  const colorScheme = useColorScheme()
  const { t } = useTranslation();
  const { registerResetHandler } = useChatContext();
  const flatListRef = useRef<any>(null);
  const navigation = useNavigation(); 
  const gradientColors = colorScheme === 'dark'
    ? ['#0f172a', '#1e293b', '#334155', '#475569', '#0f172a']
    : ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#bfdbfe', '#ffffff'];
  const topGradientColors = colorScheme === 'dark'
    ? ['#000000', 'transparent']
    : ['#CFCFCF',  'transparent'];


  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(() => `user_${Date.now()}`); // Generar ID único para el usuario
  const [currentOptions, setCurrentOptions] = useState<MessageOption[][] | undefined>(undefined);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [hiddenMessageInput, setHiddenMessageInput] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const lastContentOffset = useRef(0);

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
    setLoading(false);
    setChatInitialized(false);
  }, []);

  useEffect(() => {
    registerResetHandler(resetChat);
  }, [registerResetHandler, resetChat]);

  // Verificar conexión con el backend al cargar
  useEffect(() => {
    checkBackendConnection();
    if(!chatInitialized){
      handleOptionSelect('START');
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
    if(loading && !chatInitialized){
      console.log("Chat is initializing, please wait...");
      setFirstLoad(true);
    }else{
      setFirstLoad(false);
    }

    if (loading) return;
    const userMessage: Message = {
      id: generateUniqueId(),
      role: Role.User,
      content: callbackData
    };

    if(chatInitialized){
      setMessages(prev => [...prev, userMessage]);
      addBotHeaderMessage("Cargando...");
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
      
      if(chatInitialized){
        setMessages(prev => [...prev, botResponse]);
      }
    
    } catch (error) {
      console.error('Error sending message:', error);

      // Mostrar mensaje de error
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

  const addBotHeaderMessage = (headerText: string) => {
    const headerMessage: Message = {
      id: generateUniqueId(),
      role: Role.BotHeader,
      content: headerText
    };
    setMessages(prev => [...prev, headerMessage]);
  }

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isLastUserMessage = item.role === Role.User &&  item.id === messages.slice().reverse().find(m => m.role === Role.User)?.id;
    const isLastAssistantMessage = item.role === Role.Bot && item.id === messages.slice().reverse().find(m => m.role === Role.Bot)?.id;
    const isStreamingMessage = item.role === Role.Bot;
    
    const entering = isLastAssistantMessage ? FadeIn.duration(500) : FadeIn.duration(300);

    let content = (
      <ChatMessage
        id={item.id}
        content={item.content}
        role={item.role}
        loading={loading}
      />
    );
    console.log("Rendering message ID:", item.id, "IsLastAssistantMessage:", isLastAssistantMessage, "IsStreamingMessage:", isStreamingMessage);

    if (isLastUserMessage) {
      content = <AnchorItem>{content}</AnchorItem>;
    } else if (isLastAssistantMessage) {
      content = <StreamingItem>{content}</StreamingItem>;
    }

    return <Animated.View entering={entering}>{content}</Animated.View>;
  };

  const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());

  }

  if (messages.length !== 0 && chatInitialized) {
    return(
      <StreamingMessageListProvider>
        <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <View className={`flex-1`}>
                  <BubbleButton 
                    onPress={openDrawer} 
                    iconName="menu" 
                    additionalStyles="top-14 left-4 z-10" 
                  />
                  
                  <BubbleButton 
                    onPress={resetChat} 
                    iconName="create-outline" 
                    additionalStyles="top-14 right-4 z-10" 
                    
                  />
                <StreamingMessageList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMessage}
                  isStreaming={loading} 
                  scrollEventThrottle={16}
                  contentContainerStyle={{ 
                    paddingTop: messages.length === 0 ? 250 : 150,
                    flexGrow: 1     
                  }}
                />

                
              </View>

              {!currentOptions || currentOptions.length === 0 ? (
                <View style={{ position: 'absolute', bottom: -680, width: '100%', height: '100%' }}>
                  <MessageInput
                    options={currentOptions}
                    onOptionSelect={handleOptionSelect}
                    chatInitialized={chatInitialized}
                    query={false}
                  />
                </View>
              ) : currentOptions.length >= 5 ? (
                <View style={{ position: 'absolute', bottom: -400, width: '100%', height: '100%' }}>
                  <MessageInput
                    options={currentOptions}
                    onOptionSelect={handleOptionSelect}
                    chatInitialized={chatInitialized}
                    query={false}
                  />
                </View>
              ) : currentOptions.length >= 3 ? (
                <View style={{ position: 'absolute', bottom: -500, width: '100%', height: '100%' }}>
                  <MessageInput
                    options={currentOptions}
                    onOptionSelect={handleOptionSelect}
                    chatInitialized={chatInitialized}
                    query={false}
                  />
                </View>
              ) : (
                <View style={{ position: 'absolute', bottom: -580, width: '100%', height: '100%' }}>
                  <MessageInput
                    options={currentOptions}
                    onOptionSelect={handleOptionSelect}
                    chatInitialized={chatInitialized}
                    query={false}
                  />
                </View>
              )}
                
              {/* Top overlay gradient to soften scroll-in text */}
              <LinearGradient 
                colors={topGradientColors} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 0, y: 1 }} 
                style={{ position: 'absolute', top: -150, left: 0, right: 0, height: 180, zIndex: 1000 }}
                pointerEvents="none"
              />
            </LinearGradient>

      </StreamingMessageListProvider>
    )

  }

  return (
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View className="flex-1">
        <BubbleButton 
          onPress={openDrawer} 
          iconName="menu" 
          additionalStyles="top-14 left-4 z-10" 
        />
        
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

export default IndexChatPage