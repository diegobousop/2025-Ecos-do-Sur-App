import { View, Text } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';

export type MessageInputProps = {
    onShouldSendMessage: (message: string) => void;
}



const MessageInput = () => {
    const [message, setMessage] = useState("")
    const { bottom } = useSafeAreaInsets();
    const expanded = useSharedValue(0);


  return (
    <View>
      <Text>MessageInput</Text>
    </View>
  )
}

export default MessageInput