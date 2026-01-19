import { DrawerContentScrollView, DrawerItem, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useTranslation } from 'react-i18next';

import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { getChats } from '@/utils/database';
import { useSQLiteContext } from 'expo-sqlite';

import BubbleButton from '@/components/common/BubbleButton';
import ChatHistory from '@/components/drawer/ChatHistory';
import Text from '@/components/common/Text';
import ActionButton from '@/components/common/ActionButton';

import { useAuth } from '@/contexts/AuthContext';
import { Chat } from '@/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';

const NewChatButton = () => {
  const { resetChat } = useChatContext();
  return (
    <BubbleButton onPress={resetChat} additionalStyles="top-2 right-2" />
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

  useEffect(() => {
    loadChats();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (currentRoute === '(chat)/new') {
      setActiveChatId(null);
    }
  }, [currentRoute]);

  // Load chat history from local db
  const loadChats = async () => {
    const result = (await getChats(db)) as Chat[];
    setHistory(result);
  };

  // Changes the active chat to the history chat selected
  const handleSelectChat = (chatId: number) => {
    setActiveChatId(chatId);
    props.navigation.navigate('(chat)/[id]', {
    id: String(chatId),
  });
  }

  return (
    <View className="flex-1 mt-10">
      <ScrollView style={{ marginBottom: 100 }}>
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

      <View className="absolute top-[720px] px-4 ml-8 w-[75%] bg-white border-2 border-[#BCB6DC] rounded-[60px]">
          <Link href="/(tabs)/(modal)/settings" asChild>
            <TouchableOpacity>
              <View className="flex flex-row items-center justify-between py-3">
                <Ionicons name="person-outline" size={24} color="black" />
                <Text>{user?.username || 'Usuario invitado'}</Text>
                <Ionicons name="settings-outline" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </Link>
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
            title: "",
            drawerLabel: "Ecos Bot",
            headerShown: false,
            headerShadowVisible: false,
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            drawerIcon: () => (
              <View>
                <Text>💬</Text>
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
              <View>
                <Text>🌍
                </Text>
              </View>
            )
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