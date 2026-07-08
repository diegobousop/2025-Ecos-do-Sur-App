import Text from '@/components/common/Text';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import React from 'react';
import { Linking, Share, TouchableOpacity, useColorScheme, View, Image } from 'react-native';

type NewsTileProps = {
    title: string;
    date: string;
    body?: string;
    externalUrl?: string | null;
    onPress?: () => void;
};

const formatRelativeTime = (isoDate: string) => {
    const parsed = new Date(isoDate);

    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    const diffMs = Date.now() - parsed.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
        return 'ahora';
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 7) {
        return `${diffDays}d`;
    }

    return parsed.toLocaleDateString();
};

const NewsTile = ({ title, date, body, externalUrl, onPress }: NewsTileProps) => {
    const colorScheme = useColorScheme();
    const timeLabel = formatRelativeTime(date) || 'sin fecha';

    const shareContent = async () => {
        try {
            const message = [title, externalUrl].filter(Boolean).join('\n');

            await Share.share({
                message: message || title,
            });
        } catch (error) {
            console.error("Error sharing content:", error);
        }
    };


    return (
        <TouchableOpacity
            className="w-full border-b border-[#E5E5E5] py-4 px-4"
            onPress={onPress}
        >
            <View className="flex flex-row">
                <View className="bg-[#F4F7FF] w-24 h-24  flex-col p-4 rounded-[22px]">
                    <Image
                        source={require('@/assets/images/ecos-do-sur-logo-gray.png')}
                        className="w-[80%] h-[80%] self-center"
                        resizeMode="cover"
                    />
                </View>

                <View className="flex-col px-4 w-[80%]">

                    <Text className="text-[16px] font-sans-semibold">
                        {title}
                    </Text>
                    {body ? (
                        <Text className="text-[13px] text-gray-600 mt-1" numberOfLines={2}>
                            {body}
                        </Text>
                    ) : null}
                    <View className="flex flex-row items-center justify-between mt-2">
                        <Text>{timeLabel}</Text>
                        <TouchableOpacity
                            className="flex-row items-center ml-2 bg-transparent rounded-full"
                            onPress={shareContent}
                        >
                            <View className="flex-row items-center p-2 rounded-full">
                                <Ionicons
                                    name="share-outline"
                                    size={18}
                                    color={colorScheme === 'dark' ? 'white' : 'black'}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>


            
        </TouchableOpacity>
  )
}

export default NewsTile