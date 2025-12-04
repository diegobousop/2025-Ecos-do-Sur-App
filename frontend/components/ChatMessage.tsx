import { CHAT_MESSAGE_MAPPINGS } from '@/constants/chatMappings';
import { Message, Role } from '@/utils/interfaces';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Platform, Pressable, Text, ToastAndroid, View } from 'react-native';
import { FormattedText } from './FormattedText';
import { svgIcons } from '@/constants/icons';

interface ChatMessageProps extends Message {
    onOptionSelect?: (option: string) => void;
}

const ChatMessage = ({ content, role, options, onOptionSelect }: ChatMessageProps) => {

    const { t } = useTranslation();

    const getDisplayContent = (text: string) => {
        const translationKey = CHAT_MESSAGE_MAPPINGS[text];
        return translationKey ? t(translationKey) : text;
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(content);
        if (Platform.OS === 'android') {
            ToastAndroid.show(t("chat.message.copied") || "Mensaje copiado", ToastAndroid.SHORT);
        } else {
            Alert.alert(t("chat.message.copied") || "Mensaje copiado");
        }
    };

    if (role === Role.User) {
        return (
            <View className="flex flex-col px-3 my-3 items-end">
                <LinearGradient
                    colors={['#BEB6E6', '#E9E8EF']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ padding: 2, borderRadius: 99, maxWidth: '80%' }}
                >
                    <View className="bg-white p-3 rounded-full px-20">
                        <Text className="text-lg text-black">
                            {getDisplayContent(content)}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View className="flex flex-col px-3 my-3 items-start">
            <Image source={require('@/assets/images/ecos-logo.png')} alt="Avatar" className="w-8 h-8 mb-3 mx-3" />
            <View className="p-3 rounded-full  bg-transparent">
                <FormattedText className="text-lg text-black">
                   {getDisplayContent(content)}
                </FormattedText>
            </View>
            <Pressable 
                className="flex-row items-center mt-2 ml-3 p-2 bg-transparent rounded-full self-start" 
                onPress={copyToClipboard}
            >
                {({ pressed }) => (
                    <View className={`flex-row items-center p-2 rounded-full ${pressed ? 'bg-gray-100' : 'bg-transparent'}`}>
                        <svgIcons.CopyIcon width={16} height={16} />
                     </View>
                )}
            </Pressable>

        </View>
    )
}

export default ChatMessage