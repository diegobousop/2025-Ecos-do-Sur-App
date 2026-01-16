import { useAuth } from '@/contexts/AuthContext';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';


export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  
  return (
     <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
     </Stack>
  );
}
