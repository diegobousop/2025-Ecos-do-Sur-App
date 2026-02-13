import Text from '@/components/common/Text';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/utils/userService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

interface ConversationStats {
  totalConversations: number;
  conversationsByType: {
    urgent: number;
    info: number;
  };
  conversationsByUser: { userId: string; count: number }[];
  dailyConversationsUrgent: { date: string; count: number }[];
  dailyConversationsInfo: { date: string; count: number }[];
  timeRange: string;
}

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '365days'>('7days');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [timeRange]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        console.warn('No user ID available');
        setStats({
          totalConversations: 0,
          conversationsByType: { urgent: 0, info: 0 },
          conversationsByUser: [],
          dailyConversationsUrgent: [],
          dailyConversationsInfo: [],
          timeRange: '7days'
        });
        return;
      }

      // Obtener estadísticas del endpoint user-stats con el rango de tiempo
      const statsData = await userService.getUserStats(user.id, timeRange);
      
      setStats(statsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1f2937' : '#ffffff',
    backgroundGradientTo: isDark ? '#111827' : '#f9fafb',
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => (isDark ? '#d1d5db' : '#374151'),
    propsForLabels: {
      fontSize: 10,
    },
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">Cargando analíticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 dark:text-gray-400">No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4 gap-6">
        {/* Total de conversaciones */}
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total de Conversaciones</Text>
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">{stats.totalConversations}</Text>
        </View>

        {/* Conversaciones por tipo */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversaciones por Tipo</Text>
          {stats.conversationsByType.urgent === 0 && stats.conversationsByType.info === 0 ? (
            <View className="h-[220px] justify-center items-center">
              <Text className="text-gray-500 dark:text-gray-400">No hay conversaciones registradas</Text>
            </View>
          ) : (
            <PieChart
              data={[
                {
                  name: 'Urgente',
                  population: stats.conversationsByType.urgent || 1,
                  color: '#ef4444',
                  legendFontColor: isDark ? '#d1d5db' : '#374151',
                  legendFontSize: 12,
                },
                {
                  name: 'Info',
                  population: stats.conversationsByType.info || 1,
                  color: '#3b82f6',
                  legendFontColor: isDark ? '#d1d5db' : '#374151',
                  legendFontSize: 12,
                },
              ]}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}
        </View>

        {/* Selector de rango de tiempo */}
        <View className="flex-row gap-2 justify-center">
          <TouchableOpacity
            onPress={() => setTimeRange('7days')}
            className={`px-4 py-2 rounded-full ${
              timeRange === '7days' 
                ? 'bg-blue-500' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`font-semibold ${
              timeRange === '7days' 
                ? 'text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>7 Días</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setTimeRange('30days')}
            className={`px-4 py-2 rounded-full ${
              timeRange === '30days' 
                ? 'bg-blue-500' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`font-semibold ${
              timeRange === '30days' 
                ? 'text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>30 Días</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setTimeRange('365days')}
            className={`px-4 py-2 rounded-full ${
              timeRange === '365days' 
                ? 'bg-blue-500' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`font-semibold ${
              timeRange === '365days' 
                ? 'text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>1 Año</Text>
          </TouchableOpacity>
        </View>

        {/* Conversaciones urgentes por período */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Conversaciones Urgentes - {timeRange === '7days' ? 'Últimos 7 Días' : timeRange === '30days' ? 'Último Mes' : 'Último Año'}
          </Text>
          <View style={{ borderRadius: 16, overflow: 'hidden' }}>
            <LineChart
              data={{
                labels: (stats.dailyConversationsUrgent && stats.dailyConversationsUrgent.length > 0) 
                  ? stats.dailyConversationsUrgent.map((d, i) => {
                      // Para 30 días, mostrar cada 5 días
                      if (timeRange === '30days' && i % 5 !== 0) return '';
                      // Para 1 año, mostrar cada 30 días
                      if (timeRange === '365days' && i % 30 !== 0) return '';
                      return d.date;
                    })
                  : [''],
                datasets: [
                  {
                    data: (stats.dailyConversationsUrgent && stats.dailyConversationsUrgent.length > 0) 
                      ? stats.dailyConversationsUrgent.map(d => Math.max(d.count, 0))
                      : [0],
                  },
                ],
              }}
              width={screenWidth - 92}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ef4444',
                },
              }}
              bezier
              style={{
                borderRadius: 16,
              }}
              yAxisInterval={1}
              fromZero
            />
          </View>
        </View>

        {/* Conversaciones informativas por período */}
        <View className="flex bg-white dark:bg-gray-800 p-4
         rounded-2xl border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Conversaciones Informativas - {timeRange === '7days' ? 'Últimos 7 Días' : timeRange === '30days' ? 'Último Mes' : 'Último Año'}
          </Text>
          <View style={{ borderRadius: 16, overflow: 'hidden' }}>
            <LineChart
              data={{
                labels: (stats.dailyConversationsInfo && stats.dailyConversationsInfo.length > 0) 
                  ? stats.dailyConversationsInfo.map((d, i) => {
                      // Para 30 días, mostrar cada 5 días
                      if (timeRange === '30days' && i % 5 !== 0) return '';
                      // Para 1 año, mostrar cada 30 días
                      if (timeRange === '365days' && i % 30 !== 0) return '';
                      return d.date;
                    })
                  : [''],
                datasets: [
                  {
                    data: (stats.dailyConversationsInfo && stats.dailyConversationsInfo.length > 0) 
                      ? stats.dailyConversationsInfo.map(d => Math.max(d.count, 0))
                      : [0],
                  },
                ],
              }}
              width={screenWidth - 92}
              height={220}
              chartConfig={{
                ...chartConfig,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3b82f6',
                },
              }}
              bezier
              style={{
                borderRadius: 16,
              }}
              yAxisInterval={1}
              fromZero
            />
          </View>
        </View>

        {stats.conversationsByUser.length > 0 && (
          <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >Usuarios más activos</Text>
            <BarChart
              data={{
                labels: stats.conversationsByUser.map(u => u.userId.slice(0, 8)),
                datasets: [
                  {
                    data: stats.conversationsByUser.map(u => u.count),
                  },
                ],
              }}
              width={screenWidth - 92}
              height={220}
              chartConfig={chartConfig}
              style={{
                borderRadius: 16,
              }}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default AnalyticsPage;
