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
    <TouchableOpacity 
      className="bg-white py-4 rounded-full h-[62px] flex flex-row
       items-center justify-center border-2 border-[#BCB6DC]" onPress={onPress} {...props} >
      {loading ? <ActivityIndicator color="primary" size="small" /> : 
      <Text className="font-sans-semibold text-center text-primary text-lg">{message}</Text>}
    </TouchableOpacity>
  )
}

export default SubmitButton