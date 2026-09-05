import Text from '@/components/common/Text'
import { svgIcons } from '@/constants/icons'
import { useAuth } from '@/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Linking, Platform, TouchableOpacity, View, useColorScheme } from 'react-native'
import SettingsLink from './SettingsLink'
import { useTranslation } from 'react-i18next'

const AccountSection = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();

    const handleOpenAppSettings = () => {
        if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
        } else {
        Linking.openSettings()
        }
    }
    

    return (
        <View className=" rounded-[28px]">
            <Text className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-textSecondary'}`}>
                {t("settings.appTitle")}
            </Text>
            <View 
                className={`${colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}
                 py-8 rounded-[40px] px-4`}>
                <SettingsLink 
                    title={t("settings.language")} 
                    iconName="language-outline"
                    value={''} 
                    link={'language'}
                />

                <TouchableOpacity
                className={colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}
                onPress={() => handleOpenAppSettings()}
                >
                    <View className="flex flex-row items-center justify-between px-4  text-right">
                        <Ionicons 
                            className="w-[10%]" 
                            name="notifications-outline" 
                            size={20} 
                            color={colorScheme === 'dark' ? 'white' : 'black'} 
                        />
                        <Text 
                            className={`text-left w-[85%] text-lg ${colorScheme === 'dark' ?
                             'text-white' : 'text-black'}`}>
                            {t("settings.notifications")}
                        </Text>
                        <svgIcons.ArrowIcon
                        className="w-[5%]"
                        stroke={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                        style={{ transform: [{ rotate: '-90deg' }] }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
  )
}

export default AccountSection