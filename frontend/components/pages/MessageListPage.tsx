import MessageInput from '@/components/MessageInput'
import BubbleButton from '@/components/common/BubbleButton'
import { Message, MessageOption } from '@/utils/interfaces'
import { DrawerActions, useNavigation } from '@react-navigation/core'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import { StreamingMessageList, StreamingMessageListProvider, StreamingMessageListRef } from 'react-native-streaming-message-list'

import { LinearGradient } from 'expo-linear-gradient'

interface MessageListPageProps {
  resetChat: () => void;
  currentOptions: MessageOption[][] | undefined;
  handleOptionSelect: (option: string) => void;
  chatInitialized: boolean;
  messages: Message[];
  renderMessage: ({ item }: { item: Message; index: number }) => React.ReactElement;
  listRef: React.RefObject<StreamingMessageListRef | null>;
  loading: boolean;
  id: string;
  showScrollButton?: boolean;
  setShowScrollButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageListPage = ({
  resetChat,
  currentOptions, 
  handleOptionSelect, 
  chatInitialized, 
  messages, renderMessage, 
  loading, 
  id, 
  listRef, showScrollButton, setShowScrollButton }: MessageListPageProps) => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }
    const topGradientColors = colorScheme === 'dark' ? ['#000000', 'transparent'] : ['#CFCFCF', 'transparent'];
    
    const gradientColors = colorScheme === 'dark'
        ? ['#0f172a', '#1e293b', '#334155', '#475569', '#0f172a']
        : ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#bfdbfe'];
    const handleScroll = (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 100;
      const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      
      setShowScrollButton(!isAtBottom);
    }
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
              onScroll={handleScroll}
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              isStreaming={loading}
              scrollEventThrottle={16}
              ListHeaderComponent={
                <View style={{ height: 100 }} />
              }
              contentContainerStyle={{
                paddingTop: messages.length === 0 ? 250 : 150,
                paddingBottom: id ? 300 : 200,
                flexGrow: 1
              }}
            />


          </View>

          {!currentOptions || currentOptions.length === 0 ? (
            <View style={{ position: 'absolute', bottom: -640, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
                listRef={listRef}
                showScrollButton={showScrollButton}
                loading={loading}
              />
            </View>
          ) : currentOptions.length >= 5 ? (
            <View style={{ position: 'absolute', bottom: -360, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
                listRef={listRef}
                showScrollButton={showScrollButton}
                loading={loading}

              />
            </View>
          ) : currentOptions.length >= 3 ? (
            <View style={{ position: 'absolute', bottom: -460, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
                listRef={listRef}
                showScrollButton={showScrollButton}
                loading={loading}
              />
            </View>
          ) : (
            <View style={{ position: 'absolute', bottom: -540, width: '100%', height: '100%' }}>
              <MessageInput
                options={currentOptions}
                onOptionSelect={handleOptionSelect}
                chatInitialized={chatInitialized}
                query={false}
                chatHistoryId={id}
                listRef={listRef}
                showScrollButton={showScrollButton}
                loading={loading}
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