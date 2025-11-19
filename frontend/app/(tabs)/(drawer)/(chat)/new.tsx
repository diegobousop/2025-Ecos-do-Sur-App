import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { Message, Role } from '@/utils/interfaces';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TEST_MESSAGES: Message[] = [
   {
    role: Role.Bot,
    content: 'Hola, ¿en qué puedo ayudarte hoy?'
  },
  { 
    role: Role.User,
    content: '¿Cuál es el clima de hoy?'
  },
  {
    role: Role.Bot,
    content: 'El clima de hoy es soleado con una temperatura máxima de 25°C.'
  } 
]

const IndexChatPage = () => {

  const {t} = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);


  return (
    <View className="flex-1">
      <View className="flex-1">
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
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
           />
        )}
      </View>

      <MessageInput />
    </View>
  )
}

export default IndexChatPage