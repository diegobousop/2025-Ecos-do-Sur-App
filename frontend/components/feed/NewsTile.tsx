import Text from '@/components/common/Text';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Share, TouchableOpacity, useColorScheme, View, Image } from 'react-native';

type NewsTileProps = {
    title: string;
    date: string;
    body?: string;
    externalUrl?: string | null;
    onPress?: () => void;
    canDelete?: boolean;
    onDelete?: () => Promise<void> | void;
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

const NewsTile = ({ title, date, body, externalUrl, onPress, canDelete, onDelete }: NewsTileProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const timeLabel = formatRelativeTime(date) || 'sin fecha';

    const [optionsVisible, setOptionsVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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

    const closeOptions = () => {
        if (deleting) return;
        setOptionsVisible(false);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        if (!onDelete || deleting) return;

        setDeleting(true);
        setDeleteError(null);

        try {
            await onDelete();
            setOptionsVisible(false);
        } catch (error) {
            console.error("Error deleting news:", error);
            setDeleteError('No se pudo eliminar la noticia');
        } finally {
            setDeleting(false);
        }
    };


    return (
        <TouchableOpacity
            className="w-full border-b border-[#E5E5E5] pt-6 px-4"
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

                            <View className="flex-row items-center p-2 gap-0">
                                {canDelete ? (
                                    <TouchableOpacity
                                        className="flex-row items-center ml-2 px-4 py-4"
                                        onPress={() => setOptionsVisible(true)}
                                    >
                                        <Ionicons
                                            name="ellipsis-horizontal-outline"
                                            size={18}
                                            color={colorScheme === 'dark' ? 'white' : 'black'}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                                <TouchableOpacity
                                    className="flex-row items-center ml-2 p-4"
                                    onPress={shareContent}
                                >
                                    <Ionicons
                                        name="share-outline"
                                        size={18}
                                        color={colorScheme === 'dark' ? 'white' : 'black'}
                                    />
                                </TouchableOpacity>
                            </View>
                    </View>

                </View>

            </View>

            <Modal
                transparent
                visible={optionsVisible}
                animationType="fade"
                onRequestClose={closeOptions}
            >
                <Pressable
                    className="flex-1 bg-black/40 justify-center items-center px-8"
                    onPress={closeOptions}
                >
                    <Pressable
                        className={`w-full rounded-[22px] p-5 ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'}`}
                        onPress={() => {}}
                    >
                        <Text className="text-[16px] font-sans-semibold mb-1" numberOfLines={2}>
                            {title}
                        </Text>
                        <Text className="text-[13px] text-gray-500 mb-4">
                            ¿Quieres eliminar esta noticia? Esta acción no se puede deshacer.
                        </Text>

                        {deleteError ? (
                            <Text className="text-[13px] text-red-600 mb-2">{deleteError}</Text>
                        ) : null}

                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-red-600 rounded-full py-3 mb-2"
                            onPress={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <Ionicons name="trash-outline" size={16} color="white" />
                                    <Text className="text-white font-sans-semibold ml-2">Eliminar noticia</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-center rounded-full py-3"
                            onPress={closeOptions}
                            disabled={deleting}
                        >
                            <Text className="text-gray-500">Cancelar</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </TouchableOpacity>
  )
}

export default NewsTile
