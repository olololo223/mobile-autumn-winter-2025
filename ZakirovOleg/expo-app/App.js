import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Shop from './components/Shop';
import Stopwatch from './components/Stopwatch';
import Gallery from './components/Gallery';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{ headerTitleAlign: 'center' }}
      >
        <Drawer.Screen
          name="Shop"
          component={Shop}
          options={{ title: 'Магазин' }}
        />
        <Drawer.Screen
          name="Stopwatch"
          component={Stopwatch}
          options={{ title: 'Секундомер' }}
        />
        <Drawer.Screen
          name="Gallery"
          component={Gallery}
          options={{ title: 'Галерея' }}
        />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

