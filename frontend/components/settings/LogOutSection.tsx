import Text from '@/components/common/Text'
import { useAuth } from '@/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, useColorScheme, View } from 'react-native'


const LogOutSection = () => {
    const { signOut, isSignedIn } = useAuth()
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
            <View className={`${colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'} rounded-[40px] px-4`}>
                {!isSignedIn ? (
                <View className="mb-3">
                <View className={`mt-3 rounded-xl p-4 gap-5 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <TouchableOpacity className="flex flex-row items-center" onPress={handleLeave}>
                    <Ionicons 
                        name="log-out-outline" 
                        className="w-[10%]" 
                        size={20} 
                        color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} 
                    />
                    <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.leave")}</Text>
                    </TouchableOpacity>
                </View>
                </View>
                ):(
                <View className="mb-3">
                    <View className={`mt-3 rounded-xl p-4 gap-5 ${colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}`}>
                        <TouchableOpacity 
                            className="flex flex-row items-center" 
                            onPress={handleSignOut}
                        >
                            <Ionicons 
                                name="log-out-outline" 
                                className="w-[10%]" 
                                size={20} 
                                color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} 
                            />
                            <Text 
                                className="w-[40%] text-lg text-black dark:text-white font-semibold">
                                    {t("settings.sign-out")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                )}
            </View>
        </View>
  )
}

export default LogOutSection