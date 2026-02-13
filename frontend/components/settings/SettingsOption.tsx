import Text from '@/components/common/Text'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, useColorScheme } from 'react-native'

interface SettingsOptionProps {
  title: string
  iconName: keyof typeof Ionicons.glyphMap
  value?: string
  last?: boolean
}

const SettingsOption = ({ title, iconName, value, last }: SettingsOptionProps) => {
  const colorScheme = useColorScheme();
  return (
    <>
        <View className="flex flex-row items-center justify-between px-4  text-right">
            <Ionicons className="w-[10%]" name={iconName} size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
            <Text className={`text-left  w-[45%] text-lg ${colorScheme === 'dark' ? 'text-white' : 'text-textSecondary'}`}>{title}</Text>
            <Text className={`w-[45%] text-lg ${colorScheme === 'dark' ? 'text-gray-400' : 'text-textSecondary'}`}>{value}</Text>
        </View>
        {!last && <View className={`my-3 h-px ${colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />}
    </>

  )
}

export default SettingsOption