import MessageInput from '@/components/MessageInput';
import { Message, Role } from '@/utils/interfaces';
import { Text, View, Image } from 'react-native';
import { useState } from 'react';
import ChatMessage from '@/components/ChatMessage';
import { FlashList } from '@shopify/flash-list';

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

  const [messages, setMessages] = useState<Message[]>([]);


  return (
    <View className="flex-1">
      <View className="flex-1">
        {messages.length === 0 ? (
          <View className="flex-1 justify-start items-center px-4">
            <Image source={require('@/assets/images/ecos-logo.png')} alt="EcosBot Illustration" resizeMode="contain" className="w-40 h-40 mb-12 mt-24" />
            <Text className="text-center text-black text-[22px] font-bold">
              ¡Bienvenido a EcosBot!
            </Text>
            <Text className="mt-5 px-5">
              Hola! Soy el chatbot Ecosbot, y mi misión es ayudarte en casos de agresión y discriminación por motivos racistas, xenófobos o islamófobos.
            {`\n \n`}
              Por favor, indícame si necesitas ayuda urgente o
              información no urgente.
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