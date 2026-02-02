import Text from '@/components/common/Text';
import userService from '@/utils/userService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, useColorScheme, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

interface ConversationStats {
  totalConversations: number;
  conversationsByType: {
    urgent: number;
    info: number;
  };
  conversationsByUser: { userId: string; count: number }[];
  dailyConversations: { date: string; count: number }[];
}

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Obtener usuarios con sus estadísticas agregadas
      const usersResponse = await userService.getAllUsers(1, 100);
      const users = usersResponse.users;
      
      if (!users || users.length === 0) {
        console.warn('No users found');
        setStats({
          totalConversations: 0,
          conversationsByType: { urgent: 0, info: 0 },
          conversationsByUser: [],
          dailyConversations: [],
        });
        return;
      }
      
      // Calcular estadísticas basadas en los datos agregados de cada usuario
      const totalConversations = users.reduce((sum, user) => sum + (user.numberOfChats || 0), 0);
      const totalUrgent = users.reduce((sum, user) => sum + (user.numberOfUrgentChats || 0), 0);
      const totalInfo = users.reduce((sum, user) => sum + (user.numberOfInformationChats || 0), 0);

      const conversationsByType = {
        urgent: totalUrgent,
        info: totalInfo,
      };

      console.log('Conversations by type:', conversationsByType);

      // Top 5 usuarios con más conversaciones
      const conversationsByUser = users
        .filter(u => u.numberOfChats > 0)
        .map(u => ({ 
          userId: u.userName, 
          count: u.numberOfChats 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      console.log('Top users:', conversationsByUser);

      // Para el gráfico de días, generar datos simulados o vacíos 
      // (no tenemos acceso a fechas individuales sin las conversaciones)
      const today = new Date();
      const dailyConversations = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        dailyConversations.push({
          date: dateStr.slice(5), // MM-DD
          count: 0, // No podemos calcular esto sin las conversaciones individuales
        });
      }

      const finalStats = {
        totalConversations,
        conversationsByType,
        conversationsByUser,
        dailyConversations,
      };
      setStats(finalStats);
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
      fontSize: 12,
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
          <PieChart
            data={[
              {
                name: 'Urgente',
                population: stats.conversationsByType.urgent,
                color: '#ef4444',
                legendFontColor: isDark ? '#d1d5db' : '#374151',
                legendFontSize: 12,
              },
              {
                name: 'Info',
                population: stats.conversationsByType.info,
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
        </View>

        {/* Conversaciones diarias (últimos 7 días) */}
        <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Últimos 7 Días</Text>
          <LineChart
            data={{
              labels: stats.dailyConversations.map(d => d.date),
              datasets: [
                {
                  data: stats.dailyConversations.map(d => d.count),
                },
              ],
            }}
            width={screenWidth - 60}
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
          />
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
              width={screenWidth - 60}
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
