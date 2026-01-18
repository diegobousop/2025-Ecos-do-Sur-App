// components/common/DebugPanel.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface DebugPanelProps {
  data: Record<string, any>;
  enabled?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ data, enabled = __DEV__ }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!enabled) return null;

  return (
    <View style={[styles.container, isExpanded && styles.containerExpanded]}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.headerText}>
          🐛 DEBUG {isExpanded ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <ScrollView style={styles.content}>
          {Object.entries(data).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.key}>{key}:</Text>
              <Text style={styles.value}>
                {typeof value === 'object' 
                  ? JSON.stringify(value, null, 2) 
                  : String(value)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ff00',
    zIndex: 9999,
    maxWidth: 300,
  },
  containerExpanded: {
    maxHeight: 400,
  },
  header: {
    padding: 8,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: '#00ff00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 8,
    maxHeight: 350,
  },
  row: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 4,
  },
  key: {
    color: '#00ff00',
    fontSize: 11,
    fontWeight: 'bold',
  },
  value: {
    color: '#ffffff',
    fontSize: 10,
    marginTop: 2,
  },
});

export default DebugPanel;