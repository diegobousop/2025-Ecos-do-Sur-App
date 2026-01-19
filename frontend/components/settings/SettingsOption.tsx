import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'
import Text from '@/components/common/Text'

interface SettingsOptionProps {
  title: string
  iconName: keyof typeof Ionicons.glyphMap
  value?: string
  last?: boolean
}

const SettingsOption = ({ title, iconName, value, last }: SettingsOptionProps) => {
  return (
    <>
        <View className="flex flex-row items-center justify-between px-4  text-right">
            <Ionicons className="w-[10%]" name={iconName} size={20} color="black" />
            <Text className="text-left  w-[45%] text-lg">{title}</Text>
            <Text className="w-[45%] text-textSecondary text-lg">{value}</Text>
        </View>
        {!last && <View className=" bg-gray-300 my-3 h-px " />}
    </>

  )
}

export default SettingsOption