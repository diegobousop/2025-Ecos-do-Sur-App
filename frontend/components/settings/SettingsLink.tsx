import Text from '@/components/common/Text'
import { svgIcons } from '@/constants/icons'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface SettingsLinkProps {
  title: string
  iconName: keyof typeof Ionicons.glyphMap
  value?: string
  last?: boolean
  link?: string
}

const SettingsLink = ({ title, iconName, value, last, link }: SettingsLinkProps) => {
  return (
    <TouchableOpacity
      className="bg-white"
      onPress={() => router.navigate(`/(tabs)/(modal)/settings/${link}`)}
    >
        <View className="flex flex-row items-center justify-between px-4  text-right">
            <Ionicons className="w-[10%]" name={iconName} size={20} color="black" />
            <Text className="text-left w-[85%] text-lg">{title}</Text>
            <svgIcons.ArrowIcon
              className="w-[5%]"
              stroke="#000000"
              style={{ transform: [{ rotate: '-90deg' }] }}
            />
        </View>
        {!last && <View className="h-px bg-gray-300 my-3" />}
    </TouchableOpacity>

  )
}

export default SettingsLink