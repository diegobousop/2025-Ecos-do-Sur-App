import { useColorScheme, View } from 'react-native'
import MessageInput from '@/components/MessageInput'
import BubbleButton from '@/components/common/BubbleButton'
import React, { useRef } from 'react'
import { StreamingMessageListProvider, StreamingMessageList } from 'react-native-streaming-message-list'
import { DrawerActions, useNavigation } from '@react-navigation/core'
import { Message, MessageOption } from '@/utils/interfaces'

import { LinearGradient } from 'expo-linear-gradient';

interface MessageListPageProps {
  resetChat: () => void;
  currentOptions: MessageOption[][] | undefined;
  handleOptionSelect: (option: string) => void;
  chatInitialized: boolean;
  messages: Message[];
  renderMessage: ({ item }: { item: Message; index: number }) => React.ReactElement;
  loading: boolean;
  id: string;
}

const MessageListPage = ({resetChat, currentOptions, handleOptionSelect, chatInitialized, messages, renderMessage, loading, id }: MessageListPageProps) => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const flatListRef = useRef<any>(null);
    const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }
    const topGradientColors = colorScheme === 'dark' ? ['#000000', 'transparent'] : ['#CFCFCF', 'transparent'];
    
    const gradientColors = colorScheme === 'dark'
        ? ['#0f172a', '#1e293b', '#334155', '#475569', '#0f172a']
        : ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#bfdbfe', '#ffffff'];
    
    return (
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
                paddingBottom: id ? 300 : 200,
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
                chatHistoryId={id}
              />
            </View>
          ) : currentOptions.length >= 5 ? (
            <View style={{ position: 'absolute', bottom: -400, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
              />
            </View>
          ) : currentOptions.length >= 3 ? (
            <View style={{ position: 'absolute', bottom: -500, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
              />
            </View>
          ) : (
            <View style={{ position: 'absolute', bottom: -580, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
              />
            </View>
          )}

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

export default MessageListPage