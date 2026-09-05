import React from 'react';
import { View } from 'react-native';
import SectionSelectorItem from './SectionSelectorItem';

interface SectionOption {
  label: string;
  value: string;
}

interface SectionSelectorProps {
  sections: SectionOption[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <View className="flex-row gap-6 w-full items-center justify-center">
      {sections.map((section) => (
        <SectionSelectorItem
          key={section.value}
          label={section.label}
          value={section.value}
          isActive={activeSection === section.value}
          onPress={onSectionChange}
        />
      ))}
    </View>
  );
};

export default SectionSelector;
