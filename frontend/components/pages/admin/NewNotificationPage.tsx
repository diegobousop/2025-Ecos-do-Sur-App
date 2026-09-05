import { ScrollView, useColorScheme } from 'react-native'
    
import ImportFromX from '@/components/admin/ImportFromX'
import ImportNew from '@/components/admin/ImportNew'
import type { ImportedTweetData } from '@/components/admin/NewNotificationInput'
import NewNotificationInput from '@/components/admin/NewNotificationInput'
import React, { useState } from 'react'

const NewNotificationPage = () => {
  const colorScheme = useColorScheme();
  const [importedData, setImportedData] = useState<ImportedTweetData | null>(null)

  return (
    <ScrollView 
          style={{ 
            backgroundColor: colorScheme === 'dark' ? '#000' : '#FFFFFF' }} 
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 240 }}
        >
      <NewNotificationInput importedData={importedData} />

      {/* <ImportFromX onImport={setImportedData} />
      <ImportNew onImport={setImportedData} /> */}
    </ScrollView>
  )
}

export default NewNotificationPage