import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

const NewsCard = () => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: 'https://dummyimage.com/1440x800/b8b8b8/6f6f6f.png&text=Mockup+Noticia',
        }}
        style={styles.mockupImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Titular de la noticia</Text>
        <Text style={styles.summary}>
          Aqui va un resumen corto de la noticia para mostrar como quedaria la card.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  mockupImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.56,
    backgroundColor: '#B8B8B8',
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
})

export default NewsCard