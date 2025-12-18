import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export function PostsTabs({ activeTab, onChange }) {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.tabActive]}
        onPress={() => onChange('all')}
      >
        <Text
          style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}
        >
          Все посты
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'my' && styles.tabActive]}
        onPress={() => onChange('my')}
      >
        <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
          Мои посты
        </Text>
      </TouchableOpacity>
    </View>
  );
}


