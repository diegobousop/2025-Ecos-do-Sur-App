import { setLocale } from '@/app/i18n/i18n.config'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Linking, Modal, Pressable, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { Platform } from 'react-native'
                             

export default function Settings() {
  const [selectedLanguage, setSelectedLanguage] = useState('es')
  const [pickerVisible, setPickerVisible] = useState(false)
  const [webViewVisible, setWebViewVisible] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState('')

  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  const router = useRouter()
  const locales = [
    { code: 'es', label: 'español' },
    { code: 'en', label: 'english' },
    { code: 'gal', label: 'galego' }
  ]

  const handleLanguagePress = () => {
    setPickerVisible(true)
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    setPickerVisible(false)
    // Aquí puedes añadir lógica para cambiar el idioma en i18n si lo necesitas
    setLocale(value)
  }

  const handleHelpCenterPress = () => {
    setWebViewUrl('https://ecosdosur.org/contacta/') // Cambia por la URL que quieras
    setWebViewVisible(true)
  }

  const handleOpenAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      Linking.openSettings()
    }
  }

  return (
    <SafeAreaView className=" bg-[#F3F2F8] dark:bg-neutral-950">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView style={{ backgroundColor: '#F3F2F8' }} contentContainerStyle={{ padding: 16 }}>
        <View className="mb-6">
          <Text className="text-m font-semibold text-gray-900 dark:text-gray-100">{t("settings.account")}</Text>
          <View className="mt-3 rounded-xl  p-4  bg-white dark:bg-neutral-900 gap-5 ">

            <View className="flex flex-row items-center">
              <Ionicons name="mail-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[30%] text-lg text-black dark:text-white font-semibold">{t("settings.email")}</Text>
              <Text className="w-[60%] text-lg text-center text-gray-700 dark:text-gray-300"> example@example.com</Text>
            </View>

            <View className="h-px bg-gray-200 dark:bg-neutral-600 opacity-60 pl-[10%]" />

            <TouchableOpacity className="flex flex-row items-center" onPress={handleOpenAppSettings} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.notifications")}</Text>
            </TouchableOpacity>

          </View>
        </View>

        <View className="mb-6">
          <Text className="text-m font-semibold text-gray-900 dark:text-gray-100">
            {t("settings.application")}
          </Text>
          <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">

            <TouchableOpacity className="flex flex-row items-center" onPress={handleLanguagePress} activeOpacity={0.7}>
              <Ionicons name="language-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[60%] text-lg text-black dark:text-white font-semibold">{t("settings.language")}</Text>
              <Text className="w-[20%] text-lg text-center text-gray-700 dark:text-gray-300">
                {locales.find(l => l.code === selectedLanguage)?.label}
              </Text>
              <Ionicons name="chevron-expand-outline" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />

            </TouchableOpacity>

            <Modal
              visible={pickerVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setPickerVisible(false)}
            >
              <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setPickerVisible(false)}>
                <View style={{
                  position: 'absolute',
                  left: 0, right: 0, bottom: 0,
                  backgroundColor: colorScheme === 'dark' ? '#18181b' : '#fff',
                  borderTopLeftRadius: 45,
                  borderTopRightRadius: 45,
                  padding: 16
                }}>
                  <Text className="text-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Selecciona un idioma</Text>
                  <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={handleLanguageChange}
                  >
                    {locales.map(locale => (
                      <Picker.Item key={locale.code} label={locale.label} value={locale.code} />
                    ))}
                  </Picker>
                </View>
              </Pressable>
            </Modal>

            <View className="h-px bg-gray-200 dark:bg-neutral-600 opacity-60 pl-[10%]" />

            <View className="flex flex-row items-center">
              <Ionicons name="information-circle-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[70%] text-lg text-black dark:text-white font-semibold">{t("settings.version")}</Text>
              <TouchableOpacity
                className="w-[20%] flex flex-row items-center"
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/VersionDetails')}
              >
                
                <Text className=" text-lg text-center text-gray-700 dark:text-gray-300">1.0.0</Text>
                <Ionicons name="chevron-forward-outline" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />

              </TouchableOpacity>

            </View>

          </View>
        </View>

        <View className="mb-6">
          <Text className="text-m font-semibold text-gray-900 dark:text-gray-100">{t("settings.about")}</Text>
          <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">

            <TouchableOpacity className="flex flex-row items-center" >
              <Ionicons name="help-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.help-center")}</Text>
            </TouchableOpacity>

            <View className="h-px bg-gray-200 dark:bg-neutral-600 opacity-60 pl-[10%]" />

            <TouchableOpacity className="flex flex-row items-center" onPress={handleHelpCenterPress}>
              <Ionicons name="call-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.contact")}</Text>
            </TouchableOpacity>

          </View>
        </View>

        <View className="mb-6">
          <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">
            <View className="flex flex-row items-center">
              <Ionicons name="log-out-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
              <Text className="w-[40%] text-lg text-black dark:text-white font-semibold">{t("settings.sign-out")}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={() => setWebViewVisible(false)}
        
      >
        <SafeAreaView className="h-[80%]" style={{ marginTop: 50, flex: 1, backgroundColor: colorScheme === 'dark' ? '#18181b' : '#fff' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10  }}>
            <TouchableOpacity onPress={() => setWebViewVisible(false)}>
              <Ionicons name="close" size={28} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>Contacto</Text>
          </View>
          <WebView 
            source={{ uri: webViewUrl }} 
            style={{ flex: 1, height: '80%' }} 
            startInLoadingState={true}
            renderLoading={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              )} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}