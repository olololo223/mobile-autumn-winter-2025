import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import Shop from './components/Shop';
import Stopwatch from './components/Stopwatch';

export default function App() {
  const [activeTab, setActiveTab] = useState('shop');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'shop' && styles.tabButtonActive]}
          onPress={() => setActiveTab('shop')}
        >
          <Text style={[styles.tabText, activeTab === 'shop' && styles.tabTextActive]}>Магазин</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'stopwatch' && styles.tabButtonActive]}
          onPress={() => setActiveTab('stopwatch')}
        >
          <Text style={[styles.tabText, activeTab === 'stopwatch' && styles.tabTextActive]}>Секундомер</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'shop' ? <Shop /> : <Stopwatch />}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

