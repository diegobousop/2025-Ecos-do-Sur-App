import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { WebView } from 'react-native-webview'

const ExplorePage = () => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://ecosdosur.org/' }}
        startInLoadingState={true}
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