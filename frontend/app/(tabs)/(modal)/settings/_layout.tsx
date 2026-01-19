import { BackButton } from '@/components/BackButton';
import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="storage" 
        options={{ 
          headerShown: false,
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="language" 
        options={{ 
          headerShown: false,
          presentation: 'card',
        }} 
      />

      <Stack.Screen 
        name="change-personal-info" 
        options={{
            headerShown: false,
            presentation: 'card',
          }} 
      />
    </Stack>
  );
}