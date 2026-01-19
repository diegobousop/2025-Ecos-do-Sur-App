import { Platform, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Text from '@/components/common/Text'
import { useAuth } from '@/contexts/AuthContext'
import SettingsLink from './SettingsLink'
import SettingsOption from './SettingsOption'
import { svgIcons } from '@/constants/icons'
import { Ionicons } from '@expo/vector-icons'
import { Linking } from 'react-native'

const AccountSection = () => {
    const { user } = useAuth();

    const handleOpenAppSettings = () => {
        if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
        } else {
        Linking.openSettings()
        }
    }
    

    return (
        <View className=" rounded-[28px]">
            <Text className="font-sans-bold text-textSecondary ml-8 mb-2">Aplicación</Text>
            <View className="bg-white py-8 rounded-[40px] px-4">
                <SettingsLink 
                    title="Idioma" 
                    iconName="language-outline"
                    value={user?.email || ''} 
                    link={'language'}
                />

                <TouchableOpacity
                className="bg-white"
                onPress={() => handleOpenAppSettings()}
                >
                    <View className="flex flex-row items-center justify-between px-4  text-right">
                        <Ionicons className="w-[10%]" name="notifications-outline" size={20} color="black" />
                        <Text className="text-left w-[85%] text-lg">Notificaciones</Text>
                        <svgIcons.ArrowIcon
                        className="w-[5%]"
                        stroke="#000000"
                        style={{ transform: [{ rotate: '-90deg' }] }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
  )
}

export default AccountSection