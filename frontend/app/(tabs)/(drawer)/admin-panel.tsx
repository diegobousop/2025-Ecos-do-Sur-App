import SectionSelector from '@/components/admin/SectionSelector';
import Text from '@/components/common/Text';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import UserAdminPage from '@/components/pages/UserAdminPage';
import React from 'react';
import { View } from 'react-native';

type Section = 'users' | 'settings' | 'analytics';

const sections = [
  { label: 'Usuarios', value: 'users' },
  // { label: 'Configuración', value: 'settings' },
  { label: 'Analíticas', value: 'analytics' },
];

const AdminPanel = () => {
  const [activeSection, setActiveSection] = React.useState<Section>('users');

  return (
    <View style={{ flex: 1 }} className="bg-white dark:bg-gray-900 pt-10">
      <View className="px-4 pt-4 pb-2">
        <SectionSelector
          sections={sections}
          activeSection={activeSection}
          onSectionChange={(section) => setActiveSection(section as Section)}
        />
      </View>

      {/* Contenido de la sección */}
      <View className="flex-1 px-4 py-2">
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
            <AnalyticsPage />
          </View>
        )}
      </View>
    </View>
  )
}

export default AdminPanel