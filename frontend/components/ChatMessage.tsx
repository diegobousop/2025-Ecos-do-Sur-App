import { Message, Role } from '@/utils/interfaces';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChatMessageProps extends Message {
    onOptionSelect?: (option: string) => void;
}

const ChatMessage = ({ content, role, options, onOptionSelect }: ChatMessageProps) => {
    return (
        <View className={`flex flex-col px-3 my-3 ${role === Role.User ? 'items-end' : 'items-start'}`}>
            <View className={`p-3 rounded-lg max-w-[80%] ${role === Role.User ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <Text className={`text-base ${role === Role.User ? 'text-white' : 'text-black'}`}>
                    {content}
                </Text>
            </View>

            {role === Role.Bot && options && options.length > 0 && (
                <View className="mt-2 w-full">
                    {options.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} className="flex-row justify-start flex-wrap gap-2 mb-2">
                            {row.map((option, optIndex) => (
                                <TouchableOpacity
                                    key={`opt-${rowIndex}-${option.callback_data}`}
                                    className="bg-white border border-blue-500 rounded-full px-4 py-2"
                                    onPress={() => onOptionSelect?.(option.callback_data)}
                                >
                                    <Text className="text-blue-500 font-medium">{option.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}

export default ChatMessage