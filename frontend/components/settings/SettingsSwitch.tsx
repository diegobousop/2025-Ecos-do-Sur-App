import React, { useEffect, useState } from 'react';
import { Switch, View } from 'react-native';

import Text from '@/components/common/Text';

interface SettingsSwitchProps {
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}

const SettingsSwitch = ({ title, value: externalValue, onValueChange, disabled = false }: SettingsSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(externalValue ?? false);

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
    <View className=" bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full">
      <Text className="text-lg" style={{ opacity: disabled ? 0.5 : 1 }}>{title}</Text>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        disabled={disabled}
      />
    </View>
  )
}

export default SettingsSwitch