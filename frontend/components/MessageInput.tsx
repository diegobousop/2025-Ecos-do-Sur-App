import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { useChatContext } from '@/contexts/ChatContext';
import { MessageOption } from '@/utils/interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { BackButton } from './BackButton';
import BlurView from 'expo-blur/build/BlurView';
import { svgIcons } from '@/constants/icons';
import ScrollToBottomButton from './chat/ScrollToBottomButton';
import { StreamingMessageListRef } from 'react-native-streaming-message-list';



export type MessageInputProps = {
  options?: MessageOption[][];
  onOptionSelect: (callbackData: string) => void;
  chatInitialized: boolean;
  firstLoad?: boolean;
  query: boolean;
  chatHistoryId: string;
  listRef?: React.RefObject<StreamingMessageListRef | null>;
  showScrollButton?: boolean;
  loading: boolean;
}

const getDefaultOptions = (t: (key: string) => string): MessageOption[][] => [
  [{ text: t("chat.message.urgent"), callback_data: "urgent" }],
  [{ text: t("chat.message.info"), callback_data: "info" }]
];

const getFinishedOptions = (t: (key: string) => string): MessageOption[][] => [
];

const MessageInput = ({ 
  options, 
  onOptionSelect, 
  chatInitialized, 
  firstLoad, 
  query, 
  chatHistoryId, 
  listRef,
  showScrollButton,
  loading
}: MessageInputProps) => {

  const { resetChat } = useChatContext();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const hasBackOption = options?.some(row => row.some(opt => opt.callback_data === 'BACK'));

  const filteredOptions = options?.map(row => row.filter(opt => opt.callback_data !== 'BACK')).filter(row => row.length > 0);

  const displayOptions = (options && options.length > 0) ? (filteredOptions || []) 
    : (getFinishedOptions(t));

  const flatOptions = displayOptions.flat();
  const totalOptions = flatOptions.length;

  if (!chatInitialized && !chatHistoryId) {
    const defaultOptions = getDefaultOptions(t).flat();

    return (
      <View 
        className={`absolute bottom-0 left-0 right-0 border ${colorScheme === 'dark' ? 'border-[#272727]' : 'border-[#E5E7EB]'} mx-5 ${colorScheme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-[#D1E9FF]'} rounded-[40px] p-5 mb-10`} 
        style={{ maxHeight: '50%'}}>
        <Text className={`text-center text-[18px] mb-2 mt-2 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
          {t("chat.querySuggestion")}
        </Text>

        {firstLoad && (
          <ActivityIndicator 
            size="small"
            color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
            className="ml-2"
          />
        )}

        <ScrollView 
          className="mt-2" 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {defaultOptions.map((option) => (
            <Pressable
              key={option.callback_data}
              onPress={() => onOptionSelect(option.callback_data)}
            >
              {({ pressed }) => (
                <LinearGradient
                  colors={pressed ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']}
                  className="relative flex flex-row items-center justify-center mt-2 border px-4 py-5 gap-3"
                  style={{
                    borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                    borderRadius: 20,
                    paddingVertical: 15,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    className="text-center text-lg flex-1 font-semibold"
                    style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                  >
                    {option.text}
                  </Text>
                </LinearGradient>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <>
    {listRef && (<ScrollToBottomButton listRef={listRef} showScrollButton={showScrollButton} loading={loading} />)}
    <View className={`flex flex-col border ${colorScheme === 'dark' ? 'border-[#272727]' : 'border-[#E5E7EB]'} mx-5 ${colorScheme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-[#D1E9FF]'} rounded-[40px] p-5 mb-10 ${options?.length === 0 ? 'h-32' : ''}`} style={{ maxHeight: '50%'}}>
      <View className="flex flex-row justify-center items-center gap-3">
            {(hasBackOption || options?.length === 0) && (
          <BackButton 
            className=" z-10" 
            onPress={() => {
              if (options?.length === 0) {
                resetChat()
              } else  {
              onOptionSelect('BACK')
              }
            }} 
          />
        )}
        <View>
          {options?.length !== 0 && query && (
            <Text className={`text-center text-[18px] mb-2 mt-2 ${colorScheme === 'dark' ? 'text-[#8F8F8F]' : 'text-black'}`}>{t("chat.querySuggestion")}</Text>
          )}
          {options?.length !== 0 && !query && (
            <Text className={`text-center text-[18px] mb-2 mt-2 ${colorScheme === 'dark' ? 'text-[#8F8F8F]' : 'text-black'}`}>{t("chat.answerSuggestion")}</Text>
          )}
        
          {firstLoad && (
            <ActivityIndicator 
              size="small"
              color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
              className="ml-2"
            />
          )}
        </View>
        
      </View>
      
      <ScrollView 
        className="mt-2" 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 8 }}
      >            
        {/* Caso 1: 2 o 0 opciones */}
        {totalOptions <= 3 && flatOptions.map((option) => (
          <Pressable
            key={option.callback_data}
            onPress={() => onOptionSelect(option.callback_data)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? (colorScheme === 'dark' ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']) : (colorScheme === 'dark' ? ['#272727', 'transparent'] : ['#FBFDFF', '#EEF7FF'])}
                className={`relative flex flex-row items-center justify-center mt-2 border ${colorScheme === 'dark' ? 'border-[#272727]' : 'border-[#E5E7EB]'} px-4 py-5 gap-3`}
                style={{
                  borderColor: pressed ? '#60A5FA' : '#262626',
                  borderRadius: 20,
                  paddingVertical: 15,
                  marginBottom: 12,
                }}
              >
                <Text
                  className="text-center text-lg flex-1 font-semibold"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        ))}

        {/* Caso 2: Entre 2 y 4 opciones */}
        {totalOptions > 3 && totalOptions <= 5 && flatOptions.map((option) => (
          <Pressable
            key={option.callback_data}
            onPress={() => onOptionSelect(option.callback_data)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']}
                className="relative flex flex-row items-center justify-center mt-2  border px-4 py-5 gap-3"
                style={{
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                  borderRadius: 20,
                  paddingVertical: 15,
                  marginBottom: 12,
                }}
              >
                <Text
                  className="text-center text-lg flex-1 font-semibold"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        ))}

        {/* Caso 3: Más de 4 opciones */}
        {totalOptions > 5 && flatOptions.map((option) => (
          <Pressable
            key={option.callback_data}
            onPress={() => onOptionSelect(option.callback_data)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#EFF6FF', '#D1E9FF'] : ['#FBFDFF', '#EEF7FF']}
                className="relative flex flex-row items-center justify-center mt-2  border px-4 py-2 gap-3"
                style={{
                  borderColor: pressed ? '#60A5FA' : '#E5E7EB',
                  borderRadius: 20,
                  paddingVertical: 15,
                  marginBottom: 12,
                }}
              >
                <Text
                  className="text-center text-lg flex-1 font-semibold"
                  style={{ color: pressed ? '#1D4ED8' : '#000000' }}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
    
    </>
  )
}

export default MessageInput