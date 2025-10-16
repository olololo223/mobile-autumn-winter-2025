import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Shop from './components/Shop';
import Stopwatch from './components/Stopwatch';
import Gallery from './components/Gallery';
import LoginScreen from './loginRegisterScreens/LoginScreen';
import RegisterScreen from './loginRegisterScreens/RegisterScreen';
import { useAuthStore } from './stores/auth';
import { TouchableOpacity, Text } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const { user } = useAuthStore();

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity onPress={() => useAuthStore.getState().logout()} 
                                style={{ paddingHorizontal: 12 }}>
                <Text style={{ color: '#007AFF', fontWeight: '600' }}>Logout</Text>
              </TouchableOpacity>
            ),
          }}
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
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Вход' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Регистрация' }}
          />
        </Stack.Navigator>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

