import React, { useState } from 'react';
import { TextInput } from 'react-native';

type CustomTextInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    errors?: string;
}

const CustomTextInput = ({value, onChangeText, placeholder, keyboardType, secureTextEntry, errors}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize="none"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ 
              borderWidth: errors ? 2 : isFocused ? 2 : 1, 
              borderColor: errors ? 'red' : isFocused ? '#4054A1' : '#ccc', 
              borderRadius: 20, 
              padding: 12,  
              height: 50,
              fontSize: 16
            }}
      />
  )
}

export default CustomTextInput