import React from 'react';
import { Pressable, View } from 'react-native';
import { BackButton } from './BackButton';
import BlurView from 'expo-blur/build/BlurView';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


type ChatEndingSelectorProps = {
  onBackPress: () => void;
  onResetPress: () => void;
};

const ChatEndingSelector = ({ onBackPress, onResetPress }: ChatEndingSelectorProps) => {
  return (
    <View className="flex flex-row justify-center items-center gap-14">
        <BackButton 
            className="z-10 " 
            onPress={onBackPress} 
        />
        <Pressable
            onPress={onResetPress}
            className={`rounded-full `}
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
                <Ionicons name="arrow-down" size={24} color="primary" />
            </BlurView>
            </LinearGradient>
        )}
        </Pressable>
    </View>
  );
};

export default ChatEndingSelector;
