import { svgIcons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { migrateDbIfNeeded } from '@/utils/database';
import { router, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, TouchableOpacity, View } from 'react-native';


export default function TabLayout() {
  const { isLoaded } = useAuth();
  const { t } = useTranslation();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const content = (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
          name="(modal)/settings"
          options={{
            headerTitle: t("settings.modalTitle"),
            headerTitleStyle: {
              fontFamily: 'OpenSans_600SemiBold',
            },
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
  );
  
  if (Platform.OS === 'web') {
    return content;
  }

  return (
    <Suspense fallback={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>}>
      <SQLiteProvider databaseName="chat.db" onInit={migrateDbIfNeeded} useSuspense>      
        {content}
      </SQLiteProvider>
    </Suspense>
  );
}
