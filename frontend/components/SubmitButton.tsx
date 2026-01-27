import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

type SubmitButtonProps = {
    message: string;
    onPress: () => void;
    props?: any;
    loading?: boolean;
}

const SubmitButton = ({message, onPress, props, loading}: SubmitButtonProps) => {
  return (
    <TouchableOpacity className="bg-primary py-4 rounded-full h-[62px] flex flex-row items-center justify-center" onPress={onPress} {...props} >
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text className="font-sans-semibold text-center text-white text-lg">{message}</Text>}
    </TouchableOpacity>
  )
}

export default SubmitButton