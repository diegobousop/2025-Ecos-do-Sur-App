import Text from '@/components/common/Text'
import React from 'react'
import { View, useColorScheme } from 'react-native'
import SettingsLink from './SettingsLink'
import SettingsOption from './SettingsOption'

interface AccountSectionProps {
    user?: {
        username?: string;
        email?: string;
        role?: string;
    } | null;
}

const AccountSection = ({user}: AccountSectionProps) => {
    const colorScheme = useColorScheme();
    
    if (!user) {
        return (
            <View className=" rounded-[28px]">
            <Text 
                className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' :
                 'text-textSecondary'}`}>
                Cuenta
            </Text>
            <View className={`${colorScheme === 'dark' ? 'bg-gray-800' :
                 'bg-white'} py-8 rounded-[40px] px-4`}>
                <SettingsOption 
                    title="Nombre de Usuario" 
                    iconName="person-circle-outline"
                    value={'Usuario invitado'} 
                />
                <SettingsLink 
                    title="Controles de datos" 
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
                        Cuenta
                </Text>
            )}
            <View className={`${colorScheme === 'dark' ? 'bg-[#262626]' :
                 'bg-white'} py-8 rounded-[40px] px-4`}>
                <SettingsOption 
                    title="Nombre de Usuario" 
                    iconName="person-circle-outline"
                    value={user?.username || 'Usuario invitado'} 
                    
                />
                <SettingsOption 
                    title="Correo Electrónico" 
                    iconName="mail-outline"
                    value={user?.email || ''} 
                />
                <SettingsLink 
                    title="Controles de datos" 
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