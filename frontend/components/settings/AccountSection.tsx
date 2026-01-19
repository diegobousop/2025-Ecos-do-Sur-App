import { View } from 'react-native'
import React from 'react'
import Text from '@/components/common/Text'
import { useAuth } from '@/contexts/AuthContext'
import SettingsLink from './SettingsLink'
import SettingsOption from './SettingsOption'

interface AccountSectionProps {
    user?: {
        username?: string;
        email?: string;
    } | null;
}

const AccountSection = ({user}: AccountSectionProps) => {
    
    if (!user) {
        return (
            <View className=" rounded-[28px]">
            <Text className="font-sans-bold text-textSecondary ml-8 mb-2">Cuenta</Text>
            <View className="bg-white py-8 rounded-[40px] px-4">
                <SettingsOption 
                    title="Nombre de Usuario" 
                    iconName="person-circle-outline"
                    value={user?.username || 'Usuario invitado'} 
                    last
                />
            </View>
        </View>

        );
    }
    return (
        <View className=" rounded-[28px]">
            <Text className="font-sans-bold text-textSecondary ml-8 mb-2">Cuenta</Text>
            <View className="bg-white py-8 rounded-[40px] px-4">
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
                    title="Cambiar datos personales" 
                    iconName="pencil-outline"
                    value={user?.email || ''} 
                    link={'change-personal-info'}
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