import { useAuth } from '@/contexts/AuthContext';
import { migrateDbIfNeeded } from '@/utils/database';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';


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
      </Stack>
    </SQLiteProvider>
  );
}
