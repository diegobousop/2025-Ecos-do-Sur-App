import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  iconColor?: string;
  className?: string;
}

export const BackButton = ({ onPress, style, iconColor = 'black', className = '' }: BackButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`rounded-full m-2  ${className}`}
      style={style}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={pressed ? ['#9E94CC', '#CFCED6'] : ['#B1AFDD', '#D5E0EC']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ padding: 2, borderRadius: 999, width: 56, height: 56 }}
        >
          <BlurView
            intensity={80}
            tint="extraLight"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              overflow: 'hidden',
              backgroundColor: '#E0E8F3',
            }}
          >
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </BlurView>
        </LinearGradient>
      )}
    </Pressable>
  );
};
