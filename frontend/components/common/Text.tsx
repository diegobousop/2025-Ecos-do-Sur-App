import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

const Text = ({ style, className, ...props }: TextProps) => {
  return (
    <RNText 
      className={`font-sans ${className ?? ''}`}
      style={style}
      {...props} 
    />
  );
};

export default Text;