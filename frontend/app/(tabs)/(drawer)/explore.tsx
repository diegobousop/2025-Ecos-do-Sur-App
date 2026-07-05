import Text from '@/components/common/Text'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { WebView } from 'react-native-webview'

const ExplorePage = () => {
  const [error, setError] = useState(false)
  const [key, setKey] = useState(0)
  const { t } = useTranslation()

  const handleRetry = () => {
    setError(false)
    setKey(prev => prev + 1)
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Ionicons name="cloud-offline-outline" size={48} color="#999" />
        <Text style={{ marginTop: 12, fontSize: 16, textAlign: 'center', color: '#666' }}>
          {t('explore.errorLoading', 'No se pudo cargar la página. Comprueba tu conexión a Internet.')}
        </Text>
        <TouchableOpacity 
          onPress={handleRetry} 
          style={{ marginTop: 16, backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 }}
        >
          <Text style={{ color: '#fff', fontFamily: 'OpenSans_600SemiBold' }}>
            {t('explore.retry', 'Reintentar')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        key={key}
        source={{ uri: 'https://ecosdosur.org/' }}
        startInLoadingState={true}
        onError={() => setError(true)}
        onHttpError={() => setError(true)}
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      />
    </View>
  )
}

export default ExplorePage