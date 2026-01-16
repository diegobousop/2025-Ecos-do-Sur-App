import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type BubbleButtonProps = {
  onPress: () => void;
  additionalStyles?: string;
  svgIcon?: React.JSX.Element;
  iconName?: keyof typeof Ionicons.glyphMap; // Permite pasar cualquier icono de Ionicons
}

const BubbleButton = ({ onPress, additionalStyles, iconName = 'create-outline', svgIcon }: BubbleButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} className={'absolute border-2 border-[#BCB6DC] rounded-full ' + additionalStyles}>
      <BlurView intensity={50} tint="light" style={styles.blur}>
        {svgIcon ? svgIcon : <Ionicons name={iconName} size={24} color="#4054A1" />}
      </BlurView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  blur: {
    padding: 14,
    borderRadius: 9999,
    overflow: 'hidden',
  },
});

export default BubbleButton