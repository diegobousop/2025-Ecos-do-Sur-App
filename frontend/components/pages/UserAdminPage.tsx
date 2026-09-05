import SearchBar from '@/components/common/SearchBar';
import Text from '@/components/common/Text';
import { useAuth } from '@/contexts/AuthContext';
import { UserData } from '@/utils/interfaces';
import userService from '@/utils/userService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View, useColorScheme } from 'react-native';

const UserAdminPage = () => {
  const { token } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const PAGE_SIZE = 6;
  const [responseData, setResponseData] = React.useState<UserData[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pagination, setPagination] = React.useState({
    total: 0,
    totalPages: 0,
    limit: PAGE_SIZE
  });

  const fetchUsers = React.useCallback(async (pageNum: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(pageNum, PAGE_SIZE, token ?? undefined, search);

      // Validar que la respuesta tenga la estructura esperada
      if (response.users && response.pagination) {
        setResponseData(response.users);
        setPagination({
          total: response.pagination.total,
          totalPages: response.pagination.total_pages,
          limit: response.pagination.limit
        });
      } else {
        console.error('Invalid response structure:', response);
        setResponseData([]);
        setPagination({ total: 0, totalPages: 0, limit: PAGE_SIZE });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponseData([]);
      setPagination({ total: 0, totalPages: 0, limit: PAGE_SIZE });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Reinicia a la primera página cuando cambia el término de búsqueda
  const onChangeSearch = (text: string) => {
    setSearchQuery(text);
    setPage(1);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchUsers(page, searchQuery);
    setRefreshing(false);
  }, [page, searchQuery, fetchUsers]);

  const handleNextPage = () => {
    if (page < pagination.totalPages && !loading) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1 && !loading) {
      setPage(page - 1);
    }
  };

  // Carga los usuarios (o resultados de búsqueda) cuando cambia la página o el
  // término de búsqueda, con debounce para no llamar al backend en cada tecla.
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(page, searchQuery);
    }, 350);

    return () => clearTimeout(handler);
  }, [page, searchQuery, fetchUsers])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="pt-4">
        <SearchBar
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholder="Buscar usuarios"
          keyboardType="default"
          multiline={false}
        />
      </View>

      {loading && page === 1 ? (
        <View className="flex-1 justify-center items-center py-8">
          <ActivityIndicator size="large" color="#4054A1" />
        </View>
      ) : responseData.length === 0 ? (
        <View className="flex-1 justify-center items-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            No se encontraron usuarios
          </Text>
        </View>
      ) : (
        <>
          <View className="flex flex-col gap-4 px-4">
            {responseData?.map((user) => (
              <View
                key={user._id}
                className="w-full bg-white dark:bg-gray-800 p-5 rounded-full border border-gray-200
                 dark:border-gray-700 flex flex-row justify-between items-center"
              >
                {/* Icono de rol al principio */}
                <View className="mr-3">
                  <Ionicons 
                    name={user.role === 'admin' ? 'shield-checkmark' : 'person'} 
                    size={24} 
                    color={user.role === 'admin' ? '#3b82f6' : '#6b7280'}
                  />
                </View>
              
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.userName} 
                </Text>
                
                <View className="flex-col gap-1">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Chats: {user.numberOfChats}
                  </Text>
                  <View className="flex-row gap-3">
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-red-500" />
                      <Text className="text-xs text-gray-600 dark:text-gray-400">
                        Urgente: {user.numberOfUrgentChats}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-blue-500" />
                      <Text className="text-xs text-gray-600 dark:text-gray-400">
                        Info: {user.numberOfInformationChats}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Controles de paginación */}
          <View className="flex-row justify-between items-center px-4 py-6 mb-20">
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={page === 1 || loading}
              className="rounded-full overflow-hidden"
            >
              <LinearGradient
                colors={
                  page === 1 || loading
                    ? isDark
                      ? ['#374151', '#1f2937'] // gray-700 to gray-800
                      : ['#E6EDFF', '#ffffff'] // gray-200 to gray-300
                    : isDark
                    ? ['#2563eb', '#1e40af'] // blue-600 to blue-800
                    : ['#60a5fa', '#3b82f6'] // blue-400 to blue-500
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ paddingVertical: 8, paddingHorizontal: 16 }}
              >
                <Text className={`font-semibold ${
                  page === 1 || loading
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-white'
                }`}>
                  Anterior
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View className="flex-col items-center">
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                Página {page} de {pagination.totalPages}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Total: {pagination.total} usuarios
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={page >= pagination.totalPages || loading}
              className="rounded-full overflow-hidden"
            >
              <LinearGradient
                colors={
                  page >= pagination.totalPages || loading
                    ? isDark
                      ? ['#374151', '#1f2937'] // gray-700 to gray-800
                      : ['#E6EDFF', '#ffffff'] // gray-200 to gray-300
                    : isDark
                    ? ['#2563eb', '#1e40af'] // blue-600 to blue-800
                    : ['#60a5fa', '#3b82f6'] // blue-400 to blue-500
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ paddingVertical: 8, paddingHorizontal: 16 }}
              >
                <Text className={`font-semibold ${
                  page >= pagination.totalPages || loading
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-white'
                }`}>
                  Siguiente
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  )
}

export default UserAdminPage