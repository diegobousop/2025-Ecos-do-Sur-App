import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useChatContext } from '@/contexts/ChatContext';
import chatbotService from '@/utils/chatbotService';
import { Message, MessageOption, Role } from '@/utils/interfaces';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Text, View } from 'react-native';

const IndexChatPage = () => {

  const { t } = useTranslation();
  const { registerResetHandler } = useChatContext();
  const flatListRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(() => `user_${Date.now()}`); // Generar ID único para el usuario
  const [currentOptions, setCurrentOptions] = useState<MessageOption[][] | undefined>(undefined);
  const [chatInitialized, setChatInitialized] = useState(true);

  // Función para resetear el chat
  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentOptions(undefined);
    setUserId(`user_${Date.now()}`); // Nuevo ID de usuario para nueva conversación
    setLoading(false);
    setChatInitialized(true);
  }, []);

  // Registrar la función resetChat en el contexto
  useEffect(() => {
    registerResetHandler(resetChat);
  }, [registerResetHandler, resetChat]);

  // Verificar conexión con el backend al cargar
  useEffect(() => {
    checkBackendConnection();
  }, []);

  

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
    if (loading) return;

    // Agregar mensaje del usuario a la lista
    const userMessage: Message = {
      role: Role.User,
      content: callbackData
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Enviar mensaje al backend de Elixir
      const botResponse = await chatbotService.sendMessage({
        message: callbackData,
        user_id: userId,
        type: 'text'
      });

      // Agregar respuesta del bot
      setMessages(prev => [...prev, botResponse]);

      // Actualizar las opciones del MessageInput con las nuevas opciones del backend
      setCurrentOptions(botResponse.options);
      setChatInitialized(false);
    } catch (error) {
      console.error('Error sending message:', error);

      // Mostrar mensaje de error
      const errorMessage: Message = {
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
    }
  };

  return (
    <View className="flex-1 bg-[#ffffff] ">
        {messages.length === 0 ? (
          <View className="flex-1 justify-start items-center px-4">
            <Image source={require('@/assets/images/ecos-logo.png')} alt="EcosBot Illustration" resizeMode="contain" className="w-40 h-40 mb-12 mt-24" />
            <Text className="text-center text-black text-[28px] font-bold">
              {t("chat.welcomeTile")}
            </Text>
            <Text className="mt-5 px-5">
              {t("chat.presentation")}
            </Text>
          </View>
        ) : (
          <FlashList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} onOptionSelect={handleOptionSelect} />}
            estimatedItemSize={400}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}

          />
        )}

        {loading && (
          <View className="items-center py-4">
            <Image 
              source={require('@/assets/images/loading-ecos.gif')} 
              className="w-16 h-16"
              resizeMode="contain"
            />
            <Text className="mt-2 text-gray-600">Esperando respuesta...</Text>
          </View>
        )}

      <MessageInput options={currentOptions} onOptionSelect={handleOptionSelect} chatInitialized={chatInitialized} />
    </View>
  )
}

export default IndexChatPage