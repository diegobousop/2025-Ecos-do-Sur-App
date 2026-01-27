import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Animated, TextInput, View } from 'react-native';

type CustomTextInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    errors?: string;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(({value, onChangeText, placeholder, keyboardType, secureTextEntry, errors}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedValue]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [6, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#999', errors ? 'red' : isFocused ? '#4054A1' : '#666'],
    }),
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    paddingTop: 15,
    fontFamily: 'OpenSans_400Regular',
  };

  return (
    
    <View style={{ marginBottom: 8}}>
      <LinearGradient 
          colors={['#E6EDFF', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ 
            borderRadius: 45,
          }}
        >
        <Animated.Text style={labelStyle}>
          {placeholder}
        </Animated.Text>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder=""
          autoCapitalize="none"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ 
            borderWidth: 2,
            borderColor: errors ? 'red' : isFocused ? '#4054A1' : '#ffffff', 
            borderRadius: 45, 
            padding: 12,
            paddingTop: 24,
            height: 62,
            fontSize: 16,
            fontFamily: 'OpenSans_400Regular',
            paddingHorizontal : 20 
          }}
        />
      </LinearGradient>
    </View>
  )
});

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput