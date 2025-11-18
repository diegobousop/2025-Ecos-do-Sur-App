import { Stack } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  return (
     <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
     </Stack>
  );
}
