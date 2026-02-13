import React, { useEffect, useState } from 'react';
import { Switch, useColorScheme, View } from 'react-native';

import Text from '@/components/common/Text';

interface SettingsSwitchProps {
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}

const SettingsSwitch = ({ title, value: externalValue, onValueChange, disabled = false }: SettingsSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(externalValue ?? false);
  const colorScheme = useColorScheme();

  // Sincronizar con el valor externo cuando cambie
  useEffect(() => {
    if (externalValue !== undefined) {
      setIsEnabled(externalValue);
    }
  }, [externalValue]);

  const toggleSwitch = (newValue: boolean) => {
    setIsEnabled(newValue);
    onValueChange?.(newValue);
  };

  return (
    <View className={` bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full 
      ${colorScheme === 'dark' ? 'bg-[#262626]' : 'bg-white'}`}>
      <Text 
        className={`text-lg ${colorScheme === 'dark' ? 'text-white' : 'text-textSecondary'}`} 
        style={{ opacity: disabled ? 0.5 : 1 }}>
          {title}
      </Text>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        disabled={disabled}
      />
    </View>
  )
}

export default SettingsSwitch