import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

export default function VersionDetails() {
  return (
    <ScrollView style={{ flex: 1, padding: 24, backgroundColor: '#F3F2F8' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 22 }}>v. 1.0.0</Text>

      <Text style={{fontSize: 14}} className="text-[#7E7E7E] mt-5 ml-5 mb-1 text-s">CHANGELOG</Text>
      <View style={{ borderWidth: 1, borderColor: '#F3F2F8', borderRadius: 12, overflow: 'hidden', backgroundColor: '#ffffff' }}>
        
        <View style={{ flexDirection: 'row', borderTopWidth: 0, borderColor: '#e5e7eb' }}>
          <Text style={{ flex: 1, padding: 12, fontSize: 16 }}>Diseño y creación de la app</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>Figma and React Native
          </Text>
          
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb'}}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Interfaz básica</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>React Native, Expo y TypeScript</Text>
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Backend</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>Spring Boot</Text>
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Autenticación</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>JWT</Text>
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Internacionalización</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>i18n</Text>
        </View>

      </View>

      <Text style={{fontSize: 14}} className="text-[#7E7E7E] mt-10 ml-5 mb-1 text-s">INFO GENERAL</Text>
      <View style={{ borderWidth: 1, borderColor: '#F3F2F8', borderRadius: 12, overflow: 'hidden', backgroundColor: '#ffffff' }}>
        
        <View style={{ flexDirection: 'row', borderTopWidth: 0, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Creadores</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>Diego Bouso Paz {'\n'}Laura Milagros Castro Souto {'\n'}Paloma Piot Pérez-Abadín
          </Text>
          
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb'}}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Aspectos técnicos</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>App desarrollada en React Native, Expo y TypeScript</Text>
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Fecha de lanzamiento</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>19 de noviembre 2025</Text>
        </View>
      </View>

      <Text style={{fontSize: 14}} className="text-[#7E7E7E] ml-5 mb-1 mt-10 text-s">DISPOSITIVOS DE PRUEBA</Text>
      <View style={{ borderWidth: 1, borderColor: '#F3F2F8', borderRadius: 12, overflow: 'hidden', backgroundColor: '#ffffff' }}>
        
        <View style={{ flexDirection: 'row', borderTopWidth: 0, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>iOS</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>iPhone 13
          </Text>
          
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb'}}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Android</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>Xiaomi Redmi Note 8T</Text>
        </View>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, flex: 1, padding: 12 }}>Unit testing</Text>
          <Text style={{ fontSize: 16, flex: 2, padding: 12, color: '#7E7E7E' }}>Jest</Text>
        </View>
      </View>





    </ScrollView>
  )
}