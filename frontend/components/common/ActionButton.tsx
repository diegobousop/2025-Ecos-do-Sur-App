import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

type ActionButtonProps = {
    message: string;
    onPress: () => void;
    iconName: string;
}

const ActionButton = ({message, onPress, iconName}: ActionButtonProps & { iconName: string }) => {
  return (
    <TouchableOpacity className="flex flex-row justify-center items-center bg-white py-4 rounded-full border-2 border-[#BCB6DC]" onPress={onPress}>
      <Ionicons name={iconName} size={24} color="#4054A1" className="absolute left-5"/>
      <Text className="font-sans-semibold text-center text-primary text-lg">{message}</Text>
    </TouchableOpacity>
  )
}

export default ActionButton