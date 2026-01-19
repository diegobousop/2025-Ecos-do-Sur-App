import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import Text from '@/components/common/Text'
import { useAuth } from '@/contexts/AuthContext'
import SettingsLink from './SettingsLink'
import SettingsOption from './SettingsOption'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { router, useRouter } from 'expo-router'


const LogOutSection = () => {
    const { signOut, isLoaded, token, isSignedIn, user } = useAuth()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const { t } = useTranslation()
    
    
    const handleSignOut = async () => {
    await signOut();
    router.replace('/intro');
  }
  const handleLeave = async () => {
    await router.replace('/intro');
  }

    return (
        <View className=" rounded-[28px]">
            <View className="bg-white rounded-[40px] px-4">
                {!isSignedIn ? (
                <View className="mb-6">
                <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-[#1C1C1E] gap-5">
                    <TouchableOpacity className="flex flex-row items-center" onPress={handleLeave}>
                    <Ionicons name="log-out-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                    <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.leave")}</Text>
                    </TouchableOpacity>
                </View>
                </View>
                ):(
                <View className="mb-6">
                    <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-[#1C1C1E] gap-5">
                        <TouchableOpacity 
                            className="flex flex-row items-center" 
                            onPress={handleSignOut}
                        >
                            <Ionicons name="log-out-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                            <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.sign-out")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                )}
            </View>
        </View>
  )
}

export default LogOutSection