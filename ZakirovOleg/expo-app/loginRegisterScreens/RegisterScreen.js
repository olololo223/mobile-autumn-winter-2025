import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../stores/auth';
import styles from './styles';

export default function RegisterScreen({ navigation }) {
  const { register, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    register({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
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
        <Button title="Создать аккаунт" onPress={handleRegister} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} 
                        style={styles.linkWrap}>
        <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
}
