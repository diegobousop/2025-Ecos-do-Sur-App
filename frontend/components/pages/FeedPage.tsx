import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import BubbleButton from '@/components/common/BubbleButton';
import Text from '@/components/common/Text';
import { fetchFeed, searchNotifications } from '@/utils/feedService';
import { NotificationItem } from '@/utils/interfaces';
import { DrawerActions, useNavigation } from '@react-navigation/core';
import ScreenSelector from '../common/ScreenSelector';

import NewsTile from '../feed/NewsTile';
import { router } from 'expo-router';
import SearchBar from '../common/SearchBar';

const FeedPage = () => {
  const navigation = useNavigation();
  
  const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }

  const [feedItems, setFeedItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadFeed = useCallback(async (query: string) => {
    try {
      const trimmed = query.trim();
      const items = trimmed
        ? await searchNotifications(trimmed)
        : await fetchFeed();
      setFeedItems(items);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Loads the feed (or search results) whenever the query changes, debounced
  // so we don't hit the backend on every keystroke.
  useEffect(() => {
    const handler = setTimeout(() => {
      loadFeed(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, loadFeed]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeed(searchQuery);
    setRefreshing(false);
  }, [loadFeed, searchQuery]);
   

  return (
    <View style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <BubbleButton
          iconName="menu"
          additionalStyles="top-14 right-4 z-10"
          onPress={openDrawer}
        />

        <ScreenSelector selectedScreen="feed" />

        <BubbleButton
          additionalStyles="top-14 left-4 z-10"
          onPress={() => router.push('/(tabs)/(drawer)/new')}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={150}
            />
          }
        >
          <View className="flex-1 justify-start items-center mt-36">            
            <Text 
              style={{ fontFamily: 'Merriweather_400Regular', color: '#4054A1' }} 
              className={`text-center text-[28px] mb-5`}>
                Centro de Ayuda
            </Text>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar"
              keyboardType="default"
              multiline={false}
            
            />
            
            {isLoading ? (
              <ActivityIndicator size="large" color="#4054A1" className="mt-6" />
            ) : null}
            {error ? (
              <Text className="mt-4 text-red-600">{error}</Text>
            ) : null}
            {!isLoading && !error && feedItems.length === 0 ? (
              <Text className="mt-6">No hay noticias disponibles.</Text>
            ) : null}
            {feedItems.map((item) => (
              <NewsTile
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/(drawer)/[notification-id]',
                    params: {
                      'notification-id': item._id ?? '',
                      titulo: item.titulo,
                      fecha: item.fecha,
                      cuerpo: item.cuerpo ?? '',
                      enlace_externo: item.enlace_externo ?? '',
                      url_imagen: item.url_imagen ?? '',
                    },
                  })
                }
                key={item._id ?? `${item.titulo}-${item.fecha}`}
                title={item.titulo}
                date={item.fecha}
                body={item.cuerpo}
                externalUrl={item.enlace_externo}
              />
            ))}

          </View>
        </ScrollView>
       
        
      </View>
    </View>
  )
}

export default FeedPage