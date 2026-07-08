import CustomTextInput from '@/components/common/CustomTextInput'
import SubmitButton from '@/components/SubmitButton'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { API_CONFIG } from '@/utils/apiConfig'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
 
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'

interface AttachedImage {
  uri: string
  type: 'local' | 'url'
}

export interface ImportedTweetData {
  title: string
  body: string
  author: string
  images: string[]
  sourceUrl?: string
  links?: string[]
  cuerpo?: string
  publisher?: string
  journalist?: string
}

interface NewNotificationInputProps {
  importedData?: ImportedTweetData | null
}

const NewNotificationInput = ({ importedData }: NewNotificationInputProps) => {
  
  const colorScheme = useColorScheme()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cuerpo, setCuerpo] = useState('')
  const [author, setAuthor] = useState('')
  const [publisher, setPublisher] = useState('')
  const [journalist, setJournalist] = useState('')
  const [links, setLinks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { expoPushToken } = usePushNotifications()
  const [images, setImages] = useState<AttachedImage[]>([])
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (importedData) {
      setTitle(importedData.title)
      setDescription(importedData.body)
      setCuerpo(importedData.cuerpo || '')
      setAuthor(importedData.author)
      setPublisher(importedData.publisher || '')
      setJournalist(importedData.journalist || '')
      setImages(importedData.images.map(uri => ({ uri, type: 'url' as const })))
      const newLinks: string[] = []
      if (importedData.sourceUrl) newLinks.push(importedData.sourceUrl)
      if (importedData.links && importedData.links.length) newLinks.push(...importedData.links)
      setLinks(newLinks)
    }
  }, [importedData])

  const handleClear = () => {
    setTitle('')
    setDescription('')
    setAuthor('')
    setPublisher('')
    setJournalist('')
    setImages([])
    setLinks([])
    setCuerpo('')
  }

  const handleSend = () => {
    setLoading(true)
    if (!expoPushToken) {
      Alert.alert('Falta destinatario', 'No hay Expo push token disponible en el dispositivo')
      setLoading(false)
      return
    }

    const payload = {
      to: expoPushToken,
      title: title || 'Notificación desde admin',
      body: `${description || ''}${cuerpo ? '\n\n' + cuerpo : ''}`,
      data: {
        images: images.map(i => i.uri),
        links,
        publisher,
        journalist
      }
    }

    fetch(`${API_CONFIG.BASE_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const text = await res.text()
        if (res.ok) {
          Alert.alert('Enviado', 'Notificación enviada correctamente')
          handleClear()
          setLoading(false)
        } else {
          Alert.alert('Error', `Expo push failed: ${text}`)
          setLoading(false)
        }
      })
      .catch(err => {
        console.error('Error sending notification', err)
        Alert.alert('Error', 'No se pudo enviar la notificación')
        setLoading(false)
      })
  }

  const handleAddImageFromDevice = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (!permissionResult.granted) {
      Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la galería')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, { uri: result.assets[0].uri, type: 'local' }])
    }
  }

  const handleAddImageFromUrl = () => {
    setShowUrlModal(true)
  }

  const confirmAddImageUrl = () => {
    if (imageUrl.trim()) {
      setImages(prev => [...prev, { uri: imageUrl.trim(), type: 'url' }])
      setImageUrl('')
      setShowUrlModal(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const isDark = colorScheme === 'dark'
  const textColor = isDark ? 'text-white' : 'text-black'
  const placeholderColor = isDark ? '#9CA3AF' : '#6B7280'
  const borderColor = isDark ? 'border-blue-400' : 'border-blue-500'
  const bgColor = isDark ? 'bg-[#1A1A1A]' : 'bg-white'
  const modalBgColor = isDark ? '#1A1A1A' : '#FFFFFF'

  return (
    <View>
      <Text 
        className={`font-sans-bold ml-8 mb-2 ${colorScheme === 'dark' ? 'text-gray-400' :
          'text-textSecondary'}`}>
          Nueva Notificación
      </Text>
      <View >
        {/* Title input (using shared CustomTextInput) */}
        <CustomTextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
        />
        {/* Description input (renamed from 'Cuerpo') */}
        <CustomTextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          multiline={true}
          numberOfLines={3}
        />

        {/* Bottom icons */}
        <View className="flex-row justify-center gap-6 mt-2">
          {/* <TouchableOpacity onPress={handleAddImageFromDevice}>
            <MaterialCommunityIcons 
              name="image-edit-outline" 
              size={28} 
              color={isDark ? '#A78BFA' : '#5B4CBA'} 
            />
          </TouchableOpacity> */}
          
          <TouchableOpacity onPress={handleAddImageFromUrl}>
            <MaterialCommunityIcons 
              name="link-variant-plus" 
              size={28} 
              color={isDark ? '#A78BFA' : '#5B4CBA'} 
            />
          </TouchableOpacity>
        </View>

        <SubmitButton 
                  message={"Enviar"}
                  onPress={handleSend} 
                  props={{ style: { marginTop: 10 } }} 
                  loading={loading} 
                  />

        {/* Links list */}
        {links.length > 0 && (
          <View className="mt-4">
            <Text className={`text-sm mb-2 ${textColor}`}>
              Enlaces ({links.length})
            </Text>
            <View className="flex-col gap-2">
              {links.map((link, idx) => (
                <View key={idx} className="flex-row items-center justify-between bg-gray-100 rounded-md px-3 py-2">
                  <Text className="text-sm flex-1 mr-2" numberOfLines={1} ellipsizeMode="middle">{link}</Text>
                  <TouchableOpacity onPress={() => setLinks(prev => prev.filter((_, i) => i !== idx))} className="px-2 py-1 bg-red-500 rounded">
                    <Text className="text-white">Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Attached images */}
        {images.length > 0 && (
          <View className="mt-4">
            <Text className={`text-sm mb-2 ${textColor}`}>
              Imágenes adjuntas ({images.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {images.map((image, index) => (
                  <View key={index} className="relative">
                    <Image 
                      source={{ uri: image.uri }} 
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    >
                      <MaterialCommunityIcons name="close" size={16} color="white" />
                    </TouchableOpacity>
                    <View className="absolute bottom-1 right-1">
                      <MaterialCommunityIcons 
                        name={image.type === 'local' ? 'cellphone' : 'link'} 
                        size={14} 
                        color="white" 
                      />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* URL Modal */}
        <Modal
          visible={showUrlModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUrlModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <View 
              className="w-full rounded-2xl p-5"
              style={{ backgroundColor: modalBgColor }}
            >
              <Text className={`text-lg font-semibold mb-4 ${textColor}`}>
                Añadir imagen desde URL
              </Text>
              
              <TextInput
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://ejemplo.com/imagen.jpg"
                placeholderTextColor={placeholderColor}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                className={`border ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-lg px-4 py-3 mb-4 ${textColor}`}
              />
              
              <View className="flex-row justify-end gap-3">
                <TouchableOpacity 
                  onPress={() => {
                    setImageUrl('')
                    setShowUrlModal(false)
                  }}
                  className="px-4 py-2"
                >
                  <Text className={textColor}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={confirmAddImageUrl}
                  className="bg-[#5B4CBA] px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Añadir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

export default NewNotificationInput