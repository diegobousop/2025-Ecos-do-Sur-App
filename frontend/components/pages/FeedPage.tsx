import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import BubbleButton from '@/components/common/BubbleButton';
import Text from '@/components/common/Text';
import { FEED_PAGE_SIZE, deleteNotification, fetchFeed, searchNotifications } from '@/utils/feedService';
import { NotificationItem } from '@/utils/interfaces';
import { useAuth } from '@/contexts/AuthContext';
import { DrawerActions, useNavigation } from '@react-navigation/core';
import ScreenSelector from '../common/ScreenSelector';

import NewsTile from '../feed/NewsTile';
import { router } from 'expo-router';
import SearchBar from '../common/SearchBar';

const FeedPage = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';

  const openDrawer = () => { navigation.dispatch(DrawerActions.openDrawer()); }

  const [feedItems, setFeedItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Guarda la búsqueda "vigente" para poder descartar respuestas obsoletas:
  // si el usuario cambia el texto mientras una petición está en vuelo, la que
  // llegue tarde no debe pisar el resultado nuevo.
  const activeQueryRef = useRef('');

  const fetchPage = useCallback((query: string, pageOffset: number) => {
    const trimmed = query.trim();
    return trimmed
      ? searchNotifications(trimmed, FEED_PAGE_SIZE, pageOffset)
      : fetchFeed(FEED_PAGE_SIZE, pageOffset);
  }, []);

  // Carga la primera página (reinicia la lista). Se usa al cambiar la búsqueda
  // y al hacer pull-to-refresh.
  const loadFirstPage = useCallback(async (query: string) => {
    activeQueryRef.current = query;

    try {
      const page = await fetchPage(query, 0);
      if (activeQueryRef.current !== query) return;

      setFeedItems(page.items);
      setOffset(page.nextOffset);
      setHasMore(page.hasMore);
      setError(null);
    } catch (err) {
      if (activeQueryRef.current !== query) return;
      setError('No se pudo cargar el feed');
      setHasMore(false);
    } finally {
      if (activeQueryRef.current === query) setIsLoading(false);
    }
  }, [fetchPage]);

  // Carga la siguiente página y la añade al final (scroll infinito).
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isLoading) return;

    const query = activeQueryRef.current;
    setLoadingMore(true);

    try {
      const page = await fetchPage(query, offset);
      if (activeQueryRef.current !== query) return;

      setFeedItems((prev) => [...prev, ...page.items]);
      setOffset(page.nextOffset);
      setHasMore(page.hasMore);
    } catch (err) {
      // Silencioso: si falla, el usuario puede reintentar al seguir bajando.
    } finally {
      if (activeQueryRef.current === query) setLoadingMore(false);
    }
  }, [fetchPage, loadingMore, hasMore, isLoading, offset]);

  // Recarga la primera página cuando cambia la búsqueda, con debounce para no
  // pegarle al backend en cada tecla.
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      loadFirstPage(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, loadFirstPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFirstPage(searchQuery);
    setRefreshing(false);
  }, [loadFirstPage, searchQuery]);

  // Borra la noticia en el backend y la quita de la lista local. Los errores
  // se propagan para que NewsTile los muestre dentro de su modal.
  const handleDelete = useCallback(async (item: NotificationItem) => {
    if (!item._id || !token) {
      throw new Error('missing id or token');
    }

    await deleteNotification(item._id, token);
    setFeedItems((prev) => prev.filter((current) => current._id !== item._id));
  }, [token]);

  const renderItem = useCallback(({ item }: { item: NotificationItem }) => (
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
      title={item.titulo}
      date={item.fecha}
      body={item.cuerpo}
      externalUrl={item.enlace_externo}
      canDelete={isAdmin}
      onDelete={() => handleDelete(item)}
    />
  ), [isAdmin, handleDelete]);

  // Cabecera de la lista (título + buscador). Se define fuera del JSX de
  // FlatList para que su identidad sea estable y el SearchBar no pierda el foco.
  const listHeader = (
    <View className="items-center">
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
    </View>
  );

  const listEmpty = (
    <View className="items-center">
      {isLoading ? (
        <ActivityIndicator size="large" color="#4054A1" className="mt-6" />
      ) : error ? (
        <Text className="mt-4 text-red-600">{error}</Text>
      ) : (
        <Text className="mt-6">No hay noticias disponibles.</Text>
      )}
    </View>
  );

  const listFooter = loadingMore ? (
    <ActivityIndicator size="small" color="#4054A1" className="my-4" />
  ) : null;

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

        <FlatList
          data={feedItems}
          keyExtractor={(item) => item._id ?? `${item.titulo}-${item.fecha}`}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={listFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={2}
          contentContainerStyle={{ paddingTop: 150, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={85}
              colors={['#4054A1']}
            />
          }
        />

        {/* Degradado superior: difumina el texto que sube por detrás de los
            botones/selector. Opaco arriba -> transparente abajo, según el tema.
            z-[5] lo deja por encima del contenido pero por debajo de los botones (z-10). */}
        <LinearGradient
          colors={
            isDark
              ? ['#000000', '#000000', 'rgba(0,0,0,0)']
              : ['#FFFFFF', '#FFFFFF', 'rgba(255,255,255,0)']
          }
          locations={[0, 0.6, 1]}
          pointerEvents="none"
          className="absolute top-0 left-0 right-0 z-[5]"
          style={{ height: 150 }}
        />

      </View>
    </View>
  )
}

export default FeedPage
