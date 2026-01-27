import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import BlurView from 'expo-blur/build/BlurView';
import { svgIcons } from '@/constants/icons';
import { StreamingMessageListRef } from 'react-native-streaming-message-list';

interface ScrollToBottomButtonProps {
  listRef: React.RefObject<StreamingMessageListRef | null>;
  showScrollButton?: boolean;
  loading: boolean;
}

const ScrollToBottomButton = ({listRef, showScrollButton, loading}: ScrollToBottomButtonProps) => {
  return (
    <View style={{ opacity: showScrollButton && !loading ? 1 : 0, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', paddingRight:30, marginBottom:10, backgroundColor: 'transparent' }}>
          <TouchableOpacity 
            onPress={() => {
              listRef.current?.scrollToEnd({ animated: true });
            }}
          style={{ width:40, height:40, alignItems: 'center', justifyContent: 'center' }}
          >
          <BlurView intensity={30} tint="light" style={{height: 40, width: 40, borderWidth: 1, borderColor:"#BCB6DC", paddingTop: 16, paddingLeft: 12,  borderRadius: 9999,  overflow: 'hidden'}} >
            <svgIcons.ArrowIcon />
          </BlurView>
        </TouchableOpacity>
    
    </View> 
  )
}

export default ScrollToBottomButton