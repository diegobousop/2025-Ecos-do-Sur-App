import CustomTextInput from '@/components/common/CustomTextInput'
import Text from '@/components/common/Text'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native'
import { ImportedTweetData } from './NewNotificationInput'

interface LinkInputProps {
  onImport?: (data: ImportedTweetData) => void
}

const TWEET_URL_REGEX = /^https?:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+/i

function parseTextFromHtml(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  if (!match) return ''
  return match[1]
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function extractImageUrls(html: string): string[] {
  const urls: string[] = []
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi
  let m
  while ((m = imgRegex.exec(html)) !== null) {
    urls.push(m[1])
  }
  return urls
}

const LinkInput = ({ onImport }: LinkInputProps) => {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync()
      if (text) setLink(text)
    } catch (e) {
      console.warn('Clipboard error', e)
    }
  }

  const handleInsert = async () => {
    const value = link.trim()
    if (!value) {
      Alert.alert('Introduce un enlace', 'El campo está vacío')
      return
    }
    if (!TWEET_URL_REGEX.test(value)) {
      Alert.alert('Enlace no válido', 'Introduce un enlace de X (twitter.com o x.com)')
      return
    }

    setLoading(true)
    try {
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(value)}`
      const res = await fetch(oembedUrl)
      if (!res.ok) {
        Alert.alert('Error', 'No se pudo obtener el tweet. Verifica el enlace.')
        return
      }
      const data = await res.json()
      const body = parseTextFromHtml(data.html || '')
      const images = extractImageUrls(data.html || '')

      const tweetData: ImportedTweetData = {
        title: data.author_name ? `Tweet de ${data.author_name}` : 'Tweet importado',
        body,
        cuerpo: body,
        author: data.author_name || '',
        publisher: 'X',
        journalist: data.author_name || '',
        images,
        sourceUrl: value,
      }

      onImport?.(tweetData)
      setLink('')
      Alert.alert('Importado', 'Datos del tweet cargados en el formulario')
    } catch (err) {
      console.error('oEmbed fetch error', err)
      Alert.alert('Error', 'No se pudo importar el tweet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="px-4 mt-3">
      <CustomTextInput
        value={link}
        onChangeText={setLink}
        placeholder="Inserta aquí enlace"
      />

      <View className="flex-row justify-end gap-3 mt-3">
        <TouchableOpacity onPress={pasteFromClipboard} className="px-3 py-2 rounded-lg bg-gray-800 items-center justify-center">
          <MaterialCommunityIcons name="content-paste" size={18} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleInsert}
          disabled={loading}
          className="flex-row px-4 py-2 rounded-lg bg-[#5B4CBA] items-center justify-center gap-2"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white">Importar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LinkInput