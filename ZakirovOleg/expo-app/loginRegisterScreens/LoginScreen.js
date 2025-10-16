import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../stores/auth';
import styles from './styles';

export default function LoginScreen({ navigation }) {
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Войти" onPress={handleLogin} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Register')} 
                        style={styles.linkWrap}>
        <Text style={styles.link}>
          Нет аккаунта? Зарегистрироваться
        </Text>
      </TouchableOpacity>
    </View>
  );
}
