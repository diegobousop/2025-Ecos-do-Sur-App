import MessageInput from '@/components/MessageInput'
import BubbleButton from '@/components/common/BubbleButton'
import { Message, MessageOption } from '@/utils/interfaces'
import { DrawerActions, useNavigation } from '@react-navigation/core'
import React, { useEffect, useRef } from 'react'
import { Animated, Platform, useColorScheme, useWindowDimensions, View } from 'react-native'
import { StreamingMessageList, StreamingMessageListProvider, StreamingMessageListRef } from 'react-native-streaming-message-list'

import { useChatContext } from '@/contexts/ChatContext'
import { LinearGradient } from 'expo-linear-gradient'
import ScreenSelector from '../common/ScreenSelector'

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
    const { width, height } = useWindowDimensions();
    const longScreen = height / width > 2.2;
    const { getIsIncognito } = useChatContext();
    const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }
    const topGradientColors = colorScheme === 'dark' ? ['#000000', 'transparent'] :
     ['#ffffff', 'transparent'];
    
    const backgroundColor = colorScheme === 'dark' ? '#000000' : '#ffffff';
    const gradientColors = [backgroundColor, backgroundColor];
    
    // Animated value for MessageInput position
    const bottomPosition = useRef(new Animated.Value(-640)).current;
    const previousPosition = useRef(-640);
    
    // Calculate target position based on options
    const getTargetPosition = () => {
      if (!currentOptions || currentOptions.length === 0) return longScreen ? -680 : -640;
      if (currentOptions.length >= 5) return longScreen ? -350 : -250;
      if (currentOptions.length >= 3) return longScreen ? -380 : -420;
      if (currentOptions.length >= 2) return longScreen ? -460 : -420;
      return longScreen ? -550 : -520;
    };
    
    // Animate position when options change
    useEffect(() => {
      const targetPosition = getTargetPosition();
      if (targetPosition !== previousPosition.current) {
        Animated.timing(bottomPosition, {
          toValue: targetPosition,
          duration: 200,
          useNativeDriver: false,
        }).start();
        previousPosition.current = targetPosition;
      }
    }, [currentOptions]);
    
    const handleScroll = (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 100;
      const isAtBottom = 
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      
      setShowScrollButton(!isAtBottom);
    }
    return (
    <StreamingMessageListProvider>
        <LinearGradient 
          colors={gradientColors} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 0, y: 1 }} 
          style={{ flex: 1 }}
        >
          <View className={`flex-1`}>
            <BubbleButton
              onPress={openDrawer}
              iconName="menu"
              additionalStyles="top-14 right-4 z-10"
            />

            <ScreenSelector selectedScreen="chat" />

            <BubbleButton
              onPress={resetChat}
              iconName="create-outline"
              additionalStyles="top-14 left-4 z-10"

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
                Platform.OS === 'ios' ? <View style={{ height: 100 }} /> : null
              }
              contentContainerStyle={{
                paddingTop: messages.length === 0 ? 250 : 150,
                paddingBottom: id ? 400 : 200,
                flexGrow: 1
              }}
            />
          </View>

          <Animated.View 
            style={{ 
              position: 'absolute', 
              bottom: bottomPosition, 
              width: '100%', 
              height: '100%' }}
          >
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
          </Animated.View>

          <LinearGradient
            colors={topGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ 
              position: 'absolute', 
              top: -150, 
              left: 0, 
              right: 0, 
              height: 180, 
              zIndex: 1000 
            }}
            pointerEvents="none"
          />
        </LinearGradient>

      </StreamingMessageListProvider>
  )
}

export default MessageListPage