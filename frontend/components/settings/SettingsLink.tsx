import Text from '@/components/common/Text'
import { svgIcons } from '@/constants/icons'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View, useColorScheme } from 'react-native'

interface SettingsLinkProps {
  title: string
  iconName: keyof typeof Ionicons.glyphMap
  value?: string
  last?: boolean
  link?: string
}

const SettingsLink = ({ title, iconName, value, last, link }: SettingsLinkProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      className={colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}
      onPress={() => router.navigate(`/(tabs)/(modal)/settings/${link}`)}
    >
        <View className="flex flex-row items-center justify-between px-4  text-right">
            <Ionicons className="w-[10%]" name={iconName} size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
            <Text className={`text-left w-[85%] text-lg ${colorScheme === 'dark' ? 'text-white' : 'text-textSecondary'}`}>
              {title}</Text>
            <svgIcons.ArrowIcon
              className="w-[5%]"
              stroke={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
              style={{ transform: [{ rotate: '-90deg' }] }}
            />
        </View>
        {!last && <View className={`h-px my-3 ${colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />}
    </TouchableOpacity>

  )
}

export default SettingsLink