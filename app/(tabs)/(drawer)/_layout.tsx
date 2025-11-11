import { View, Text, TouchableOpacity } from 'react-native'
import { Drawer } from 'expo-router/drawer'
import React from 'react'

import { Link } from 'expo-router'

import { Ionicons } from '@expo/vector-icons';

const Layout = () => {
  return (
    <Drawer>
        <Drawer.Screen 
          name='(chat)/new' 
          options={{ 
            title: 'EcosBot', 
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
            title: 'Ecos do Sur', 
            drawerIcon: () => (
              <View>
                <Text>🌍
                </Text>
              </View>
            )
            }} 
        />


    </Drawer>
  )
}

export default Layout