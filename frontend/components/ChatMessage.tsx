import Text from '@/components/common/Text';
import { CHAT_MESSAGE_MAPPINGS } from '@/constants/chatMappings';
import { svgIcons } from '@/constants/icons';
import { Message, Role } from '@/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Platform, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Share } from 'react-native';
import { FormattedText } from './FormattedText';



interface ChatMessageProps extends Message {
    onOptionSelect?: (option: string) => void;
    loading?: boolean;
    isLastMessage?: boolean;
}

const ChatMessage = ({ content, role, options, onOptionSelect, loading, isLastMessage }: ChatMessageProps) => {
    
    const colorScheme = useColorScheme();
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

    const shareContent = async () => {
    try {
        await Share.share({
            message: content,
        });
    } catch (error) {
        console.error("Error sharing content:", error);
    }
};

    if (role === Role.User) {
        return (
            <View className="flex flex-col px-3 my-3 items-end ">
                <LinearGradient
                    colors={['#BEB6E6', '#E9E8EF']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ padding: 2, borderRadius: 99, maxWidth: '80%' }}
                >
                    <View className={`${colorScheme === 'dark' ? 'bg-black' : 'bg-white'} p-3 rounded-full px-10`}>
                        <Text className={`text-lg ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                            {getDisplayContent(content)}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    if (role === Role.BotHeader) {
        return (
            <View className="flex flex-col px-3  items-start justify-center ">

                {loading  ? (
                    <View className="flex flex-row items-center py-4">
                        <Image 
                        source={require('@/assets/images/loading-ecos.gif')} 
                        className="w-10 h-10 mx-3"
                        resizeMode="contain"
                        />
                        <Text className={`text-m  ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {content}
                        </Text>
                    </View>
                ) : (<>
                    <Image source={require('@/assets/images/ecos-logo.png')} alt="Avatar" className="w-10 h-10 mb-3 mx-3" />
                    </>
                )}
            </View>
        )
    }



    return (
        <View className="flex flex-col px-3  items-start">
            <View className="p-3 rounded-full  bg-transparent">
                <FormattedText className={`text-lg ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                   {getDisplayContent(content)}
                </FormattedText>
            </View>

            <View className="flex flex-row">
                <TouchableOpacity
                className="flex-row items-center  ml-3  bg-transparent rounded-full self-start" 
                onPress={copyToClipboard}
                >
                <View className={`flex-row items-center p-2 rounded-full`}>
                        <svgIcons.CopyIcon width={16} height={16} />
                     </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center ml-2 bg-transparent rounded-full self-start" 
                    onPress={shareContent}
                    >
                    <View className={`flex-row items-center p-2 rounded-full`}>
                        <Ionicons name="share-outline" size={16} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </View>
                </TouchableOpacity>
            </View>
            


        </View>
    )
}

export default ChatMessage