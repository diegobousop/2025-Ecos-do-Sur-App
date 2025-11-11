import MessageInput from '@/components/MessageInput';
import { Message, Role } from '@/utils/interfaces';
import { Text, View } from 'react-native';
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

  const [messages, setMessages] = useState<Message[]>(TEST_MESSAGES);


  return (
    <View className="flex-1">
      <View className="flex-1">
        {TEST_MESSAGES.length === 0 ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-center text-gray-500 text-[26px]">
              ¡Bienvenido a EcosBot! 🌍💬
              {'\n\n'}
              Haz tu primera pregunta para comenzar a explorar el ecosistema de Ecos do Sur.
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