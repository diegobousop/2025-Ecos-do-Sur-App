import Text from '@/components/common/Text'
import React from 'react'
import { View, useColorScheme } from 'react-native'
import SettingsLink from './SettingsLink'
import SettingsOption from './SettingsOption'
import { useTranslation } from 'react-i18next'

interface AccountSectionProps {
    user?: {
        username?: string;
        email?: string;
        role?: string;
    } | null;
}

const AccountSection = ({user}: AccountSectionProps) => {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    if (!user) {
        return (
            <View className=" rounded-[28px]">
            <Text 
                className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' :
                 'text-textSecondary'}`}>
                {t("settings.accountTitle")}
            </Text>
            <View className={`${colorScheme === 'dark' ? 'bg-gray-800' :
                 'bg-white'} py-8 rounded-[40px] px-4`}>
                <SettingsOption 
                    title={t("settings.userName")}
                    iconName="person-circle-outline"
                    value={'Usuario invitado'} 
                />
                <SettingsLink 
                    title={t("settings.dataControls")}
                    iconName="settings-outline"
                    value={''} 
                    link={'storage'}
                    last
                />
            </View>
        </View>

        );
    }
    return (
        <View className=" rounded-[28px]">
            {user.role === 'admin' ? (
                <Text 
                    className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' :
                     'text-textSecondary'}`}>
                        Cuenta de Admin
                </Text>

            ):(
                <Text 
                    className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' :
                     'text-textSecondary'}`}>
                        {t("settings.accountTitle")}
                </Text>
            )}
            <View className={`${colorScheme === 'dark' ? 'bg-[#262626]' :
                 'bg-white'} py-8 rounded-[40px] px-4`}>
                <SettingsOption 
                    title={t("settings.userName")}
                    iconName="person-circle-outline"
                    value={user?.username || 'Usuario invitado'} 
                />
                <SettingsOption 
                    title={t("settings.email")}
                    iconName="mail-outline"
                    value={user?.email || ''} 
                />
                <SettingsLink 
                    title={t("settings.dataControls")}
                    iconName="settings-outline"
                    value={user?.email || ''} 
                    link={'storage'}
                    last
                />
            </View>
        </View>
  )
}

export default AccountSection