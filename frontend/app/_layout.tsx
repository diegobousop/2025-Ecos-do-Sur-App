import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
import './globals.css';
import './i18n/i18n.config';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OpenSans_300Light, OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold, useFonts } from '@expo-google-fonts/open-sans';
import { 
  Merriweather_300Light, 
  Merriweather_400Regular, 
  Merriweather_700Bold,
  Merriweather_900Black 
} from '@expo-google-fonts/merriweather';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { svgIcons } from '@/constants/icons';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'intro',
  anchor: '(tabs)',
};

function InitialLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="intro" options={{ headerShown: false }}/>
      <Stack.Screen name="login" 
      options={{
        presentation: 'modal',
        headerShadowVisible: false,
        headerTitle: '',
        headerRight: () => (
          <TouchableOpacity     
            onPress={() => {
            router.back();
                }}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <svgIcons.CloseIcon  />
          </TouchableOpacity>
        ),
      }}
      />
      <Stack.Screen name="register" 
        options={{
          presentation: 'modal',
          headerShadowVisible: false,
          headerTitle: '',
          headerRight: () => (
            <TouchableOpacity     
              onPress={() => {
              router.back();
                  }}
              style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <svgIcons.CloseIcon  />
            </TouchableOpacity>
          ),
      }}
      />
      <Stack.Screen name="(tabs)" 
        options={{ headerShown: false }}/>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    Merriweather_300Light,
    Merriweather_400Regular,
    Merriweather_700Bold,
    Merriweather_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
