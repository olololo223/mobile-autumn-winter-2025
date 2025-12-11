import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './styles';

export function ProfileCard({ 
  profile, 
  loading, 
  error, 
  onRetry, 
  onLogout 
}) {
  if (loading) {
    return (
      <View style={styles.authLoadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.authErrorContainer}>
        <Text style={styles.authErrorText}>{error}</Text>
        <TouchableOpacity
          style={[styles.btnLg, styles.authButtonBlue]}
          onPress={onRetry}
        >
          <Text style={styles.btnLgText}>Повторить</Text>
        </TouchableOpacity>
        {onLogout && (
          <TouchableOpacity
            style={[styles.btnLg]}
            onPress={onLogout}
          >
            <Text style={styles.btnLgText}>Выйти</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={styles.authCard}>
      <Text style={styles.authCardTitle}>Профиль</Text>
      <View style={styles.authField}>
        <Text style={styles.authFieldLabel}>Email:</Text>
        <Text style={styles.authFieldValue}>{profile.email}</Text>
      </View>
      {profile.name && (
        <View style={styles.authField}>
          <Text style={styles.authFieldLabel}>Имя:</Text>
          <Text style={styles.authFieldValue}>{profile.name}</Text>
        </View>
      )}
      <View style={styles.authField}>
        <Text style={styles.authFieldLabel}>Роль:</Text>
        <Text style={styles.authFieldValue}>{profile.role || 'USER'}</Text>
      </View>
      <View style={styles.authField}>
        <Text style={styles.authFieldLabel}>ID:</Text>
        <Text style={styles.authFieldValueSmall}>{profile.id}</Text>
      </View>
      {profile.createdAt && (
        <View style={styles.authField}>
          <Text style={styles.authFieldLabel}>Дата регистрации:</Text>
          <Text style={styles.authFieldValueSmall}>
            {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
          </Text>
        </View>
      )}
      {onLogout && (
        <TouchableOpacity
          style={[styles.btnLg, styles.authButtonRed]}
          onPress={onLogout}
        >
          <Text style={styles.btnLgText}>Выйти</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
