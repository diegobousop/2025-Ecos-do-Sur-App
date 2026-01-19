import React, { useState } from 'react';
import { Switch, View } from 'react-native';

import Text from '@/components/common/Text';

interface SettingsSwitchProps {
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const SettingsSwitch = ({ title, value: externalValue, onValueChange }: SettingsSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(externalValue ?? false);

  const toggleSwitch = (newValue: boolean) => {
    setIsEnabled(newValue);
    onValueChange?.(newValue);
  };

  return (
    <View className=" bg-white flex flex-row justify-between items-center px-8 py-7 rounded-full">
      <Text className="text-lg">{title}</Text>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
      />
    </View>
  )
}

export default SettingsSwitch