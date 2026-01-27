import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { migrateDbIfNeeded } from '@/utils/database';
import { router, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';


export default function TabLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  
  return (
    <SQLiteProvider databaseName="chat.db" onInit={migrateDbIfNeeded}>      
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
            name="(modal)/settings"
            options={{
              headerTitle: 'Settings',
              presentation: 'modal',
              headerShadowVisible: false,
              headerRight: () => (
                <TouchableOpacity     
                  onPress={() => {
                    router.back();
                  }}
                  style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <svgIcons.CloseIcon  />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <TouchableOpacity     
                  onPress={() => router.back()}
                  style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <svgIcons.ArrowIcon 
                      style={{ transform: [{ rotate: '90deg' }] }}
                  />
                </TouchableOpacity>
              ),
                headerTransparent: true,

              headerStyle: {
                backgroundColor: 'transparent',
              },

            }}
          />
          

      </Stack>
      
    </SQLiteProvider>
  );
}
