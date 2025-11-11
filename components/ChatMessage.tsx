import { View, Text } from 'react-native'
import React from 'react'
import { Message, Role } from '@/utils/interfaces';

const ChatMessage = ({content, role, imageUrl, prompt}: Message) => {
  return (
    <View className="flex flex-row justify-start px-3 my-3">
      {role === Role.Bot ? (
        <View>
            <Text className="text-xl">{content}</Text>
        </View>
      ) : (
        <View>
            <Text className="text-xl">{content}</Text>
        </View>
      )}
    </View>
  )
}

export default ChatMessage