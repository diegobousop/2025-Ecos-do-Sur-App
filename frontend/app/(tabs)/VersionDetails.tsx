import React from 'react'
import { ScrollView, Text, View, useColorScheme } from 'react-native'


export default function VersionDetails() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const Row = ({ label, value, first }: { label: string; value: string; first?: boolean }) => (
    <View style={{ flexDirection: 'row', borderTopWidth: first ? 0 : 1, borderColor: isDark ? '#374151' : '#e5e7eb' }}>
      <Text style={{ fontSize: 16, flex: 1, padding: 12, color: isDark ? '#fff' : '#000' }}>{label}</Text>
      <Text style={{ fontSize: 16, flex: 2, padding: 12, color: isDark ? '#D1D5DB' : '#7E7E7E' }}>{value}</Text>
    </View>
  )

  return (
    <ScrollView style={{ flex: 1, padding: 24, backgroundColor: isDark ? '#000' : '#F3F2F8' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 22, color: isDark ? '#fff' : '#000' }}>v. 1.1.0</Text>

      <Text style={{ fontSize: 14, color: isDark ? '#D1D5DB' : '#7E7E7E', marginTop: 20, marginLeft: 5, marginBottom: 4 }}>CHANGELOG</Text>
      <View style={{ borderWidth: 1, borderColor: isDark ? '#1C1C1E' : '#F3F2F8', borderRadius: 12, overflow: 'hidden', backgroundColor: isDark ? '#1C1C1E' : '#ffffff' }}>
        <Row label="Chatbot" value="Compatible ahora con el Chatbot de Elixir!" first />
        <Row label="Temas" value="Disponible en modo claro y oscuro" />
        <Row label="Internacionalización" value="Nuevos mensajes en 3 nuevos idiomas" />
      </View>

      <Text style={{ fontSize: 14, color: isDark ? '#D1D5DB' : '#7E7E7E', marginTop: 20, marginLeft: 5, marginBottom: 4 }}>INFO GENERAL</Text>
      <View style={{ borderWidth: 1, borderColor: isDark ? '#1C1C1E' : '#F3F2F8', borderRadius: 12, overflow: 'hidden', backgroundColor: isDark ? '#1C1C1E' : '#ffffff' }}>
        <Row label="Creadores" value={'Diego Bouso Paz\nLaura Milagros Castro Souto\nPaloma Piot Pérez-Abadín'} first />
        <Row label="Aspectos técnicos" value="App desarrollada en React Native, Expo y TypeScript" />
        <Row label="Fecha de lanzamiento" value="4 de diciembre 2025" />
      </View>

      <Text style={{ fontSize: 14, color: isDark ? '#D1D5DB' : '#7E7E7E', marginTop: 20, marginLeft: 5, marginBottom: 4 }}>DISPOSITIVOS DE PRUEBA</Text>
      <View style={{ borderWidth: 1, borderColor: isDark ? '#1C1C1E' : '#F3F2F8', borderRadius: 12, overflow: 'hidden', backgroundColor: isDark ? '#1C1C1E' : '#ffffff' }}>
        <Row label="iOS" value="iPhone 13" first />
        <Row label="Android" value="Xiaomi Redmi Note 8T y Pixel 9" />
        <Row label="Unit testing" value="Jest" />
      </View>

    </ScrollView>
  )
}