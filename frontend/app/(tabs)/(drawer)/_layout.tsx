import { DrawerContentScrollView, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useTranslation } from 'react-i18next';

import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { getChats } from '@/utils/database';
import { useSQLiteContext } from 'expo-sqlite';

import ActionButton from '@/components/common/ActionButton';
import BubbleButton from '@/components/common/BubbleButton';
import Text from '@/components/common/Text';
import ChatHistory from '@/components/drawer/ChatHistory';

import { useAuth } from '@/contexts/AuthContext';
import { Chat } from '@/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const NewChatButton = () => {
  const { resetChat } = useChatContext();
  return (
    <BubbleButton onPress={resetChat} additionalStyles="top-2 right-2" />
  );
};

const DrawerMenuButton = () => {
  const navigation = useNavigation();
  const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); };
  return (
    <BubbleButton
      onPress={openDrawer}
      iconName="menu"
      additionalStyles="top-1 left-4 z-10"
    />
  );
};

export const CustomDrawerContent = (props: any) => {
  const { user } = useAuth();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const { t } = useTranslation();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [history, setHistory] = useState<Chat[]>([]);
  const db = useSQLiteContext();
  const currentRoute = props.state?.routes[props.state?.index]?.name;

  // Load chat history from local db
  const loadChats = useCallback(async () => {
    const userId = user?.id || null;
    const result = (await getChats(db, userId)) as Chat[];
    setHistory(result);
  }, [db, user?.id]);

  useEffect(() => {
    loadChats();
  }, [isDrawerOpen, loadChats]);

  // Reload chats when user changes (login/logout/switch account)
  useEffect(() => {
    loadChats();
  }, [user?.id, loadChats]);

  // reload chats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      loadChats();
    }, 2000);
    return () => clearInterval(interval);
  }, [loadChats]);

  useEffect(() => {
    if (currentRoute === '(chat)/new') {
      setActiveChatId(null);
    }
  }, [currentRoute]);

  // Changes the active chat to the history chat selected
  const handleSelectChat = (chatId: number) => {
    setActiveChatId(chatId);
    props.navigation.navigate('(chat)/[id]', {
    id: String(chatId),
  });
  }

  return (
    <View className="flex-1 mt-10">
      <ScrollView>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        
        {user ? (
          <ChatHistory 
            history={history} 
            activeChatId={activeChatId} 
            onSelectChat={handleSelectChat} 
            loadChats={loadChats}
            
          />
        ) : (
          <View className="flex flex-col justify-between gap-5 text-center px-5 mb-10">
            <Text className="text-center  px-4">{t('drawer.promo_text')}</Text>
            <ActionButton 
              iconName="log-in" 
              message={t('drawer.register_or_login')} 
              onPress={() => router.push('/intro')} 
            />
          </View>
        )}
        
        <Text className="text-center mb-4 text-gray-500">
            2026 Ecos do Sur
        </Text>
      </ScrollView>
      <TouchableOpacity onPress={() => router.push('/(tabs)/(modal)/settings')} className="mb-20 mr-2 px-4 ml-4 ">
        <View className=" bg-white border-2 border-[#BCB6DC] rounded-[60px] px-10 py-2">
         
              
                <View className="flex flex-row items-center justify-between py-3">
                  <Ionicons name="person-outline" size={24} color="black" />
                  <Text>{user?.userName || 'Usuario invitado'}</Text>
                  <Ionicons name="settings-outline" size={24} color="black" />
                </View>
        </View>
      </TouchableOpacity>
      
    </View>
  )

}


const Layout = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <ChatProvider>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveTintColor: '#000000', 
          drawerInactiveTintColor: '#000000', 
          drawerActiveBackgroundColor: '#F3F3F3', 
          drawerInactiveBackgroundColor: 'transparent',
          
       
          drawerLabelStyle: {
            fontFamily: 'OpenSans_600SemiBold', 
            fontSize: 16,
            fontWeight: '600',
          },
          drawerItemStyle: {
            marginHorizontal: 8,
            paddingHorizontal: 8,
            justifyContent: 'flex-start',
          },
        }}
      >
        <Drawer.Screen
          name='(chat)/new'
          options={{
            title: "",
            drawerLabel: "Ecos Bot",
            headerShown: false,
            headerShadowVisible: false,
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            drawerIcon: () => (
              <View >
                <Image 
                  source={require('@/assets/images/ecos-do-sur-logo-black.png')} 
                  style={{ width: 28, height: 28 }} />
              </View>
            ),
            headerRight: () => <NewChatButton />,
          }}
        />

        <Drawer.Screen
          name='explore'
          options={{
            title: t('drawer.ecos'),
            drawerIcon: () => (
              <View className="ml-1">
                <Ionicons name="globe-outline" size={24} color="black" />
              </View>
            ),
            headerLeft: () => <DrawerMenuButton />,
            headerTitleStyle: {
              fontFamily: 'OpenSans_600SemiBold',
            },
          }}
        />
        <Drawer.Screen
          name='admin-panel'
          options={{
            title: "Panel de Administrador",
            headerTitleStyle: {
              fontFamily: 'OpenSans_600SemiBold',
            },
            drawerIcon: () => (
              <View className="ml-5">
                <Ionicons name="stats-chart-outline" size={24} color="black" />
              </View>
            ),
            headerLeft: () => <DrawerMenuButton />,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            drawerItemStyle: user?.role === 'admin' ? {} : { display: 'none' },
          }}
        />

        <Drawer.Screen
          name="(chat)/[id]"
          options={{
            headerShown: false,

            drawerItemStyle: {
              display: 'none',
            },
            headerRight: () => (
              <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
                <TouchableOpacity>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    style={{ marginRight: 16 }}
                  />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />

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