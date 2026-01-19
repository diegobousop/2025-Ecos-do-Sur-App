import { Redirect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

const INTRO_SEEN_KEY = 'intro_seen';

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    const checkAndMarkIntro = async () => {
      try {
        let seen = false;
        
        if (Platform.OS === 'web') {
          seen = globalThis.localStorage?.getItem(INTRO_SEEN_KEY) === 'true';
          if (!seen) {
            globalThis.localStorage?.setItem(INTRO_SEEN_KEY, 'true');
          }
        } else {
          const value = await SecureStore.getItemAsync(INTRO_SEEN_KEY);
          seen = value === 'true';
          if (!seen) {
            await SecureStore.setItemAsync(INTRO_SEEN_KEY, 'true');
          }
        }
        
        setHasSeenIntro(seen);
      } catch (error) {
        console.error('Error checking intro:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    checkAndMarkIntro();
  }, []);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Primera vez: ir a intro (ya quedó marcada para la próxima)
  if (!hasSeenIntro) {
    return <Redirect href="/intro" />;
  }

  // Ya vio la intro: ir al chat
  return <Redirect href="/(tabs)/(drawer)/(chat)/new" />;
}
