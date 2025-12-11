import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { styles } from './styles';

export function LoginForm({ 
  show, 
  email, 
  password, 
  error, 
  loading, 
  onEmailChange, 
  onPasswordChange, 
  onLogin, 
  onSwitchToRegister 
}) {
  if (!show) return null;

  return (
    <View style={styles.authFormContainer}>
      <Text style={styles.authFormTitle}>Вход (Backend API)</Text>
      {error && <Text style={styles.authErrorText}>{error}</Text>}
      <TextInput
        style={styles.authFormInput}
        placeholder="Email"
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.authFormInput}
        placeholder="Пароль"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.authFormButton} onPress={onLogin}>
          <Text style={styles.authFormButtonText}>Войти</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.authFormSwitch}
        onPress={onSwitchToRegister}
      >
        <Text style={styles.authFormSwitchText}>
          Нет аккаунта? Зарегистрироваться
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function RegisterForm({ 
  show, 
  name, 
  email, 
  password, 
  error, 
  loading, 
  onNameChange, 
  onEmailChange, 
  onPasswordChange, 
  onRegister, 
  onSwitchToLogin 
}) {
  if (!show) return null;

  return (
    <View style={styles.authFormContainer}>
      <Text style={styles.authFormTitle}>Регистрация (Backend API)</Text>
      {error && <Text style={styles.authErrorText}>{error}</Text>}
      <TextInput
        style={styles.authFormInput}
        placeholder="Имя (необязательно)"
        value={name}
        onChangeText={onNameChange}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.authFormInput}
        placeholder="Email"
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.authFormInput}
        placeholder="Пароль"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.authFormButton} onPress={onRegister}>
          <Text style={styles.authFormButtonText}>Создать аккаунт</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.authFormSwitch}
        onPress={onSwitchToLogin}
      >
        <Text style={styles.authFormSwitchText}>
          Уже есть аккаунт? Войти
        </Text>
      </TouchableOpacity>
    </View>
  );
}
