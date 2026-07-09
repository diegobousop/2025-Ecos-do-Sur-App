import MessageInput from '@/components/MessageInput'
import BubbleButton from '@/components/common/BubbleButton'
import { Message, MessageOption } from '@/utils/interfaces'
import { DrawerActions, useNavigation } from '@react-navigation/core'
import React from 'react'
import { Platform, useColorScheme, View } from 'react-native'
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
    const { getIsIncognito } = useChatContext();
    const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }
    const topGradientColors: readonly [string, string, string] = colorScheme === 'dark'
      ? ['#000000', '#000000', 'rgba(0,0,0,0)']
      : ['#ffffff', '#ffffff', 'rgba(255,255,255,0)'];
    
    const backgroundColor = colorScheme === 'dark' ? '#000000' : '#ffffff';
    const gradientColors = [backgroundColor, backgroundColor];

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

            {/* Degradado superior: difumina los mensajes que suben por detrás de
                los botones/selector. Opaco arriba -> transparente abajo, según el tema.
                zIndex 5 lo deja por encima de la lista pero por debajo de los botones (z-10). */}
            <LinearGradient
              colors={topGradientColors}
              locations={[0, 0.6, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 110,
                zIndex: 5,
              }}
            />
          </View>

          {/* Contenedor anclado al fondo: ocupa toda la pantalla y empuja el
              MessageInput abajo con justify-end, así crece hacia arriba (hasta su
              maxHeight) sin salirse. box-none deja pasar los toques a la lista de
              mensajes; el pequeño margen inferior lo da paddingBottom + el mb-14
              del propio MessageInput. */}
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'flex-end',
              paddingBottom: 8,
            }}
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
          </View>
        </LinearGradient>

      </StreamingMessageListProvider>
  )
}

export default MessageListPage