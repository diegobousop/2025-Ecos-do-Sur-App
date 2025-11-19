import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

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
            headerRight: () => (
              <Link href="/(tabs)/(drawer)/(chat)/new" push asChild>
                <TouchableOpacity>
                  <Ionicons name="create-outline" size={24} color="black" 
                  style={{ marginRight: 12 }} />
                </TouchableOpacity>
              </Link>
            )
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
  )
}

export default Layout