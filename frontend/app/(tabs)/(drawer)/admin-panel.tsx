import SectionSelector from '@/components/admin/SectionSelector';
import Text from '@/components/common/Text';
import AnalyticsPage, { ConversationStats } from '@/components/pages/AnalyticsPage';
import UserAdminPage from '@/components/pages/UserAdminPage';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/utils/userService';
import React, { useCallback, useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import NewNotificationPage from '@/components/pages/admin/NewNotificationPage';

type Section = 'users' | 'settings' | 'analytics';

const sections = [
  { label: 'Notificaciones', value: 'notifications' },
  { label: 'Usuarios', value: 'users' },
  // { label: 'Configuración', value: 'settings' },
  { label: 'Analíticas', value: 'analytics' },
];

type TimeRange = '7days' | '30days' | '365days';
type StatsCache = Partial<Record<TimeRange, ConversationStats>>;

const AdminPanel = () => {
  const colorScheme = useColorScheme();
  const [activeSection, setActiveSection] = React.useState<Section>('notifications');
  const { user } = useAuth();
  const [statsCache, setStatsCache] = useState<StatsCache>({});
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>('365days');
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Función para cargar stats (con cache)
  const loadStats = useCallback(async (range: TimeRange) => {
    // Si ya está en cache, no reconsultar
    if (statsCache[range]) {
      setCurrentTimeRange(range);
      return;
    }

    if (!user?.id) return;
    
    setAnalyticsLoading(true);
    try {
      const stats = await userService.getUserStats(user.id, range);
      setStatsCache(prev => ({ ...prev, [range]: stats }));
      setCurrentTimeRange(range);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [user?.id, statsCache]);

  // Función para refrescar (forzar recarga)
  const refreshStats = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const stats = await userService.getUserStats(user.id, currentTimeRange);
      setStatsCache(prev => ({ ...prev, [currentTimeRange]: stats }));
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  }, [user?.id, currentTimeRange]);

  // Precargar analytics al montar el panel
  useEffect(() => {
    if (user?.id && !statsCache['365days']) {
      loadStats('365days');
    }
  }, [user?.id, loadStats, statsCache]);

  return (
    <View 
      style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#FFFFFF'  }}>
      <View className="px-4  pb-2 mt-6">
        <SectionSelector
          sections={sections}
          activeSection={activeSection}
          onSectionChange={(section) => setActiveSection(section as Section)}
        />
      </View>

      {/* Contenido de la sección */}
      <View className="flex-1  py-2">
        {activeSection === 'notifications' && (
          <View className="flex-1">
            <NewNotificationPage />
          </View>
        )}
        {activeSection === 'users' && (
          <View className="flex-1">
            <UserAdminPage />
          </View>
        )}

        {activeSection === 'settings' && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600 dark:text-gray-400">Sección de configuración - Próximamente</Text>
          </View>
        )}

        {activeSection === 'analytics' && (
          <View className="flex-1">
            <AnalyticsPage 
              preloadedStats={statsCache[currentTimeRange] || null} 
              preloading={analyticsLoading}
              timeRange={currentTimeRange}
              onTimeRangeChange={loadStats}
              onRefresh={refreshStats}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default AdminPanel