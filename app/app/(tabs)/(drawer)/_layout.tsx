import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
  
// Componente para el botón de nuevo chat
const NewChatButton = () => {
    const colorScheme = useColorScheme(); 
  const { resetChat } = useChatContext();
  
  return (
    <TouchableOpacity onPress={resetChat}>
      <Ionicons name="create-outline" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} style={{ marginRight: 12 }} />
    </TouchableOpacity>
  );
};

export const CustomDrawerContent = (props: any) => {
  const {bottom, top} = useSafeAreaInsets();
  const { t } = useTranslation();

  return(
    <View className="flex-1 mt-10">
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View className="px-4" style={{ paddingBottom: bottom, paddingTop: top }}>
        {/* DrawerItem con ruedita que navega a Ajustes */}
        <DrawerItem
          style={{ marginBottom: 16 }}
          label={t('drawer.settings')}
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('settings')}
        />

        <Text className="text-center mb-4 text-gray-500">
          © 2025 Ecos do Sur
        </Text>
      </View>
    </View>
  )

}


const Layout = () => {
  const { t } = useTranslation();
  return (
    <ChatProvider>
    <Drawer
      drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen 
          name='(chat)/new' 
          options={{ 
            title: t('drawer.chat'), 
            drawerIcon: () => (
              <View>
                <Text>💬</Text>
              </View>
            ),
            headerRight: () => <NewChatButton />
            }} 
        />

        <Drawer.Screen 
          name='explore' 
          options={{ 
            title: t('drawer.ecos'), 
            drawerIcon: () => (
              <View>
                <Text>🌍
                </Text>
              </View>
            )
            }} 
        />

        {/* Registrar la ruta de Ajustes (oculta en la lista del drawer) */}
        <Drawer.Screen
          name="settings"
          options={{
            title: t('drawer.settings'),
            drawerItemStyle: { display: 'none' },
          }}
        />
    </Drawer>
    </ChatProvider>
  )
}

export default Layout