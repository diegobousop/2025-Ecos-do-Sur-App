import Ionicons from '@expo/vector-icons/build/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, TextInput, View } from 'react-native';

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
  errors?: string;
  multiline?: boolean;
  numberOfLines?: number;
  onMicPress?: () => void;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(({
    value, onChangeText, placeholder, keyboardType, secureTextEntry, errors, multiline, numberOfLines}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedValue]);


  return (
    
    <View className=" w-full px-6 mb-10" >
      <LinearGradient 
          colors={['#E6EDFF', '#FAFCFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ 
            borderRadius: 45,
          }}
        >
       
        {secureTextEntry === true ? (
          <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder=""
          autoCapitalize="none"
          secureTextEntry={true}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={{ 
            borderWidth: 2,
            borderColor: errors ? 'red' : isFocused ? '#4054A1' : '#ffffff', 
            borderRadius: 45, 
            padding: 12,
            paddingTop: multiline ? 12 : 24,
            height: multiline ? undefined : 62,
            textAlignVertical: multiline ? 'top' : 'center',
            fontSize: 16,
            fontFamily: 'OpenSans_400Regular',
            paddingHorizontal : 20 
          }}
        />
        ):(
          <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCapitalize="none"
          secureTextEntry={false}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ 
            borderWidth: 2,
            borderColor: errors ? 'red' : isFocused ? '#4054A1' : '#ffffff', 
            borderRadius: 45, 
            padding: 12,
            height: multiline ? undefined : 62,
            textAlignVertical: multiline ? 'top' : 'center',
            fontSize: 20,
            fontFamily: 'OpenSans_400Regular',
            paddingHorizontal : 20 
          }}
        />
        )}
        
      </LinearGradient>
    </View>
  )
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;