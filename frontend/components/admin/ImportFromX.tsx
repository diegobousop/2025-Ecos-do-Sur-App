import Text from '@/components/common/Text';
import React from 'react';
import { View } from 'react-native';
import LinkInput from './LinkInput';
import { ImportedTweetData } from './NewNotificationInput';

interface ImportFromXProps {
  onImport?: (data: ImportedTweetData) => void
}

const ImportFromX = ({ onImport }: ImportFromXProps) => {
  return (
    <View className="bg-black rounded-2xl justify-center items-center py-4 mt-6 mx-4">
      <Text className='text-white'>Importar desde X</Text>
      <LinkInput onImport={onImport} />
    </View>
  )
}

export default ImportFromX