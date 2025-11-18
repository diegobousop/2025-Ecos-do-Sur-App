import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Text, useColorScheme, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const colorScheme = useColorScheme()

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}  />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-6">
          <Text className="text-m font-semibold text-gray-900 dark:text-gray-100">Cuenta</Text>
          <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">

            <View className="flex flex-row items-center">
                <Ionicons name="mail-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[30%] text-lg text-gray-700 dark:text-white font-semibold">Correo electrónico</Text>
                <Text className="w-[60%] text-lg text-center text-gray-700 dark:text-gray-300"> example@example.com</Text>
            </View>

            <View className="h-px bg-gray-200 dark:bg-neutral-600 opacity-60 pl-[10%]" />


            <View className="flex flex-row items-center">
                <Ionicons name="notifications-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[40%] text-lg text-gray-700 dark:text-white font-semibold">Notificaciones</Text>
            </View>

          </View>
        </View>

        <View className="mb-6">
          <Text className="text-m font-semibold text-gray-900 dark:text-gray-100">Aplicación</Text>
          <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">

            <View className="flex flex-row items-center">
                <Ionicons name="language-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[30%] text-lg text-gray-700 dark:text-white font-semibold">Idioma</Text>
                <Text className="w-[60%] text-lg text-center text-gray-700 dark:text-gray-300">español</Text>
            </View>

            <View className="h-px bg-gray-200 dark:bg-neutral-600 opacity-60 pl-[10%]" />


            <View className="flex flex-row items-center">
                <Ionicons name="information-circle-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[40%] text-lg text-gray-700 dark:text-white font-semibold">Versión</Text>
            </View>

          </View>
        </View>

        <View className="mb-6">
          <Text className="text-m font-semibold text-gray-900 dark:text-gray-100">Acerca de</Text>
          <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">

            <View className="flex flex-row items-center">
                <Ionicons name="help-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[40%] text-lg text-gray-700 dark:text-white font-semibold">Centro de ayuda</Text>
            </View>

            <View className="h-px bg-gray-200 dark:bg-neutral-600 opacity-60 pl-[10%]" />


            <View className="flex flex-row items-center">
                <Ionicons name="call-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[40%] text-lg text-gray-700 dark:text-white font-semibold">Contacto</Text>
                
            </View>

          </View>
        </View>

        <View className="mb-6">
            <View className="mt-3 rounded-xl  p-4 bg-white dark:bg-neutral-900 gap-5">
            <View className="flex flex-row items-center">
                <Ionicons name="log-out-outline" className="w-[10%]" size={20} color={colorScheme === 'dark' ? '#D1D5DB' : '#4B5563'} />
                <Text className="w-[40%] text-lg text-gray-700 dark:text-white font-semibold">Cerrar sesión</Text>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}