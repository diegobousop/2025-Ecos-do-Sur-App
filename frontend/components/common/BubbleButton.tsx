import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

type BubbleButtonProps = {
  onPress: () => void;
  additionalStyles?: string;
  svgIcon?: React.JSX.Element;
  iconName?: keyof typeof Ionicons.glyphMap; 
}

const BubbleButton = ({ 
  onPress, 
  additionalStyles, 
  iconName = 'create-outline', 
  svgIcon }: BubbleButtonProps) => {

  const content = svgIcon ? svgIcon : <Ionicons name={iconName} size={24} color="#4054A1" />;

  return (
    <TouchableOpacity onPress={onPress} className={'absolute border-2 border-[#BCB6DC] rounded-full ' +
     additionalStyles}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={30} tint="light" style={styles.blur}>
          {content}
        </BlurView>
      ) : (
        <View style={[styles.blur, styles.androidFallback]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  blur: {
    padding: 14,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  androidFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});

export default BubbleButton