import CustomTextInput from '@/components/common/CustomTextInput'
import Text from '@/components/common/Text'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native'
import type { ImportedTweetData } from './NewNotificationInput'

interface ImportNewProps {
  onImport?: (data: ImportedTweetData) => void
}

const TITLE_REGEX = /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']|<title>([^<]+)<\/title>/i
const DESC_META_REGEX = /<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["']([^"']+)["']/i
const AUTHOR_META_REGEX = /<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i
const BYLINE_META_REGEX = /<meta\s+name=["']byline["']\s+content=["']([^"']+)["']/i
const ARTICLE_AUTHOR_PROP_REGEX = /<meta\s+property=["']article:author["']\s+content=["']([^"']+)["']/i
const SITE_NAME_REGEX = /<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i
const PUBLISHER_META_REGEX = /<meta\s+name=["']publisher["']\s+content=["']([^"']+)["']/i
const OG_IMAGE_REGEX = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
// kept for reference, not currently used: const ARTICLE_P_REGEX = /<article[\s\S]*?>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i
const P_TAGS_REGEX = /<p[^>]*>([\s\S]*?)<\/p>/gi
const IMG_TAGS_REGEX = /<img[^>]+src=["']([^"']+)["']/gi

function stripHtml(html = '') {
  return html.replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

const ImportNew = ({ onImport }: ImportNewProps) => {
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

  const extractParagraphs = (html: string) => {
    // try article first
    const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i)
    const source = articleMatch ? articleMatch[1] : html
    const paragraphs: string[] = []
    let m
    while ((m = P_TAGS_REGEX.exec(source)) !== null) {
      const txt = stripHtml(m[1])
      if (txt) paragraphs.push(txt)
      if (paragraphs.length >= 50) break
    }
    return paragraphs
  }

  const extractImages = (html: string) => {
    const images: string[] = []
    let m
    while ((m = IMG_TAGS_REGEX.exec(html)) !== null) {
      images.push(m[1])
      if (images.length >= 5) break
    }
    return images
  }

  const handleImport = async () => {
    const value = link.trim()
    if (!value) {
      Alert.alert('Introduce un enlace', 'El campo está vacío')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(value)
      if (!res.ok) {
        Alert.alert('Error', 'No se pudo acceder a la noticia')
        return
      }
      const html = await res.text()

      const titleMatch = html.match(TITLE_REGEX)
      const title = (titleMatch && (titleMatch[1] || titleMatch[2])) ? stripHtml(titleMatch[1] || titleMatch[2]) : ''

      const descMatch = html.match(DESC_META_REGEX)
      const description = descMatch ? stripHtml(descMatch[1]) : ''

      const authorMatch = html.match(AUTHOR_META_REGEX)
      const author = authorMatch ? stripHtml(authorMatch[1]) : ''
      const bylineMatch = html.match(BYLINE_META_REGEX)
      const articleAuthorPropMatch = html.match(ARTICLE_AUTHOR_PROP_REGEX)
      const journalist = bylineMatch ? stripHtml(bylineMatch[1]) : (articleAuthorPropMatch ? stripHtml(articleAuthorPropMatch[1]) : author)

      const siteMatch = html.match(SITE_NAME_REGEX)
      const publisherMetaMatch = html.match(PUBLISHER_META_REGEX)
      const publisher = siteMatch ? stripHtml(siteMatch[1]) : (publisherMetaMatch ? stripHtml(publisherMetaMatch[1]) : '')

      const ogImageMatch = html.match(OG_IMAGE_REGEX)
      const ogImage = ogImageMatch ? ogImageMatch[1] : null

      const paragraphs = extractParagraphs(html)
      const body = description || (paragraphs.length ? paragraphs.slice(0,3).join('\n\n') : '')
      const fullBody = paragraphs.length ? paragraphs.join('\n\n') : body

      const images = [] as string[]
      if (ogImage) images.push(ogImage)
      const imgs = extractImages(html)
      for (const i of imgs) if (!images.includes(i)) images.push(i)

      const data: ImportedTweetData = {
        title: title || (body ? body.split('\n')[0] : 'Noticia importada'),
        body,
        cuerpo: fullBody,
        author: author || '',
        publisher: publisher || '',
        journalist: journalist || '',
        images,
        sourceUrl: value,
        links: [value]
      }

      onImport?.(data)
      setLink('')
      Alert.alert('Importado', 'La noticia se ha importado correctamente')
    } catch (err) {
      console.error('ImportNew error', err)
      Alert.alert('Error', 'No se pudo importar la noticia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="bg-black rounded-2xl justify-center items-center py-4 mt-4 mx-4 px-4">
      <Text className='text-white mb-2'>Importar noticia</Text>
      <CustomTextInput
        value={link}
        onChangeText={setLink}
        placeholder="Pega aquí el enlace de la noticia"
      />

      <View className="flex-row justify-end gap-3 mt-3 w-full">
        <TouchableOpacity onPress={pasteFromClipboard} className="px-3 py-2 rounded-lg bg-gray-800 items-center justify-center">
          <MaterialCommunityIcons name="content-paste" size={18} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleImport} disabled={loading} className="flex-row px-4 py-2 rounded-lg bg-[#5B4CBA] items-center justify-center gap-2">
          {loading ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white">Importar noticia</Text>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ImportNew
