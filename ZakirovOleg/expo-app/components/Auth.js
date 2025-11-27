import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/auth';
import { styles } from '../styles';

const API_BASE_URL = 'https://cloud.kit-imi.info/api';

const isValidEmail = (value) => {
  const email = String(value).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка запроса');
  }

  return data;
};

export default function Auth() {
  const { user: localUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Функция для обновления токена
  const refreshAuthToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('AUTH_REFRESH_TOKEN');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.success && response.data.accessToken) {
        const newAccessToken = response.data.accessToken;
        await AsyncStorage.setItem('AUTH_ACCESS_TOKEN', newAccessToken);
        setAccessToken(newAccessToken);
        return newAccessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Если не удалось обновить токен, разлогиниваем пользователя
      await handleLogout();
      throw error;
    }
  };

  // Функция выхода
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'AUTH_ACCESS_TOKEN',
        'AUTH_REFRESH_TOKEN',
        'AUTH_USER'
      ]);
      setAccessToken(null);
      setProfile(null);
      setUsers([]);
      setPagination(null);
      setError(null);
    } catch (e) {
      console.error('Error during logout:', e);
    }
  };

  // Улучшенная функция apiRequest с обработкой истекшего токена
  const authApiRequest = async (url, options = {}, retry = true) => {
    try {
      const token = options.headers?.Authorization?.replace('Bearer ', '') || accessToken;
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      // Если токен истек и это первая попытка, пробуем обновить
      if (response.status === 401 && retry) {
        console.log('Token expired, attempting refresh...');
        const newToken = await refreshAuthToken();
        if (newToken) {
          // Повторяем запрос с новым токеном
          return authApiRequest(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          }, false); // false чтобы избежать бесконечного цикла
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса');
      }

      return data;
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('expired')) {
        await handleLogout();
        Alert.alert('Сессия истекла', 'Пожалуйста, войдите снова');
      }
      throw error;
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('AUTH_ACCESS_TOKEN');
        if (token) {
          setAccessToken(token);
          loadProfile(token);
          loadUsers(token);
        }
      } catch (e) {
        console.error('Error loading token:', e);
      }
    };
    loadToken();
  }, []);

  const loadProfile = async (token = accessToken) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authApiRequest('/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.success && response.data.user) {
        setProfile(response.data.user);
      }
    } catch (e) {
      setError(e.message || 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (token = accessToken, page = 1) => {
    if (!token) return;
    try {
      setUsersLoading(true);
      const queryString = new URLSearchParams({ page, limit: 10 }).toString();
      const response = await authApiRequest(`/auth/users?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      }
    } catch (e) {
      console.error('Error loading users:', e);
      if (e.message.includes('401') || e.message.includes('expired')) {
        setError('Сессия истекла. Войдите снова.');
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!accessToken) return;
    setRefreshing(true);
    try {
      await Promise.all([loadProfile(), loadUsers(accessToken, currentPage)]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (!loginEmail || !loginPassword) {
        throw new Error('Введите email и пароль');
      }
      if (!isValidEmail(loginEmail)) {
        throw new Error('Неверный формат email');
      }

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Ошибка входа');
      }

      const { user, accessToken: token, refreshToken } = response.data;
      await AsyncStorage.setItem('AUTH_ACCESS_TOKEN', token);
      await AsyncStorage.setItem('AUTH_REFRESH_TOKEN', refreshToken || '');
      await AsyncStorage.setItem('AUTH_USER', JSON.stringify(user));
      
      setAccessToken(token);
      setProfile(user);
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
      
      // Загружаем данные после успешного входа
      loadUsers(token);
    } catch (e) {
      setAuthError(e.message || 'Ошибка входа');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (!registerEmail || !registerPassword) {
        throw new Error('Заполните все поля');
      }
      if (!isValidEmail(registerEmail)) {
        throw new Error('Неверный формат email');
      }

      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email: registerEmail, 
          password: registerPassword,
          name: registerName.trim() || undefined,
        }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Ошибка регистрации');
      }

      const { user, accessToken: token, refreshToken } = response.data;
      await AsyncStorage.setItem('AUTH_ACCESS_TOKEN', token);
      await AsyncStorage.setItem('AUTH_REFRESH_TOKEN', refreshToken || '');
      await AsyncStorage.setItem('AUTH_USER', JSON.stringify(user));
      
      setAccessToken(token);
      setProfile(user);
      setShowRegister(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
      
      // Загружаем данные после успешной регистрации
      loadUsers(token);
    } catch (e) {
      setAuthError(e.message || 'Ошибка регистрации');
    } finally {
      setAuthLoading(false);
    }
  };

  // Добавляем кнопку выхода в профиль
  const renderLogoutButton = () => {
    if (!accessToken) return null;
    
    return (
      <TouchableOpacity
        style={[styles.btnLg, styles.authButtonRed]}
        onPress={handleLogout}
      >
        <Text style={styles.btnLgText}>Выйти</Text>
      </TouchableOpacity>
    );
  };

  const renderLoginForm = () => {
    if (!showLogin) return null;
    return (
      <View style={styles.authFormContainer}>
        <Text style={styles.authFormTitle}>Вход (Backend API)</Text>
        {authError && <Text style={styles.authErrorText}>{authError}</Text>}
        <TextInput
          style={styles.authFormInput}
          placeholder="Email"
          value={loginEmail}
          onChangeText={setLoginEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.authFormInput}
          placeholder="Пароль"
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
        />
        {authLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.authFormButton} onPress={handleLogin}>
            <Text style={styles.authFormButtonText}>Войти</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.authFormSwitch}
          onPress={() => {
            setShowLogin(false);
            setShowRegister(true);
            setAuthError(null);
          }}
        >
          <Text style={styles.authFormSwitchText}>
            Нет аккаунта? Зарегистрироваться
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRegisterForm = () => {
    if (!showRegister) return null;
    return (
      <View style={styles.authFormContainer}>
        <Text style={styles.authFormTitle}>Регистрация (Backend API)</Text>
        {authError && <Text style={styles.authErrorText}>{authError}</Text>}
        <TextInput
          style={styles.authFormInput}
          placeholder="Имя (необязательно)"
          value={registerName}
          onChangeText={setRegisterName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.authFormInput}
          placeholder="Email"
          value={registerEmail}
          onChangeText={setRegisterEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.authFormInput}
          placeholder="Пароль"
          value={registerPassword}
          onChangeText={setRegisterPassword}
          secureTextEntry
        />
        {authLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.authFormButton} onPress={handleRegister}>
            <Text style={styles.authFormButtonText}>Создать аккаунт</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.authFormSwitch}
          onPress={() => {
            setShowRegister(false);
            setShowLogin(true);
            setAuthError(null);
          }}
        >
          <Text style={styles.authFormSwitchText}>
            Уже есть аккаунт? Войти
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProfileCard = () => {
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
            onPress={() => loadProfile()}
          >
            <Text style={styles.btnLgText}>Повторить</Text>
          </TouchableOpacity>
          {renderLogoutButton()}
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
        {renderLogoutButton()}
      </View>
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.authUserCard}>
      <View style={styles.authUserCardContent}>
        <View style={styles.authUserCardInfo}>
          <Text style={styles.authUserCardName}>
            {item.name || item.email}
          </Text>
          {item.name && (
            <Text style={styles.authUserCardEmail}>
              {item.email}
            </Text>
          )}
          <Text style={styles.authUserCardRole}>
            Роль: {item.role || 'USER'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderUsersSection = () => {
    if (!accessToken) return null;
    
    return (
      <View style={styles.authSection}>
        <Text style={styles.authSectionTitle}>Пользователи</Text>
        {usersLoading && users.length === 0 ? (
          <View style={styles.authLoadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {users.length === 0 ? (
              <View style={styles.authEmptyContainer}>
                <Text style={styles.authEmptyText}>Нет пользователей</Text>
              </View>
            ) : (
              users.map((item) => (
                <View key={item.id}>
                  {renderUserItem({ item })}
                </View>
              ))
            )}
            {pagination && pagination.totalPages > 1 && (
              <View style={styles.authPagination}>
                <TouchableOpacity
                  style={[
                    styles.btnLg,
                    styles.authButtonBlue,
                    { opacity: pagination.hasPrev ? 1 : 0.5, minWidth: 100 },
                  ]}
                  onPress={() => loadUsers(accessToken, currentPage - 1)}
                  disabled={!pagination.hasPrev || usersLoading}
                >
                  <Text style={styles.btnLgText}>Назад</Text>
                </TouchableOpacity>
                <Text style={styles.authPaginationText}>
                  Страница {pagination.currentPage} из {pagination.totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.btnLg,
                    styles.authButtonBlue,
                    { opacity: pagination.hasNext ? 1 : 0.5, minWidth: 100 },
                  ]}
                  onPress={() => loadUsers(accessToken, currentPage + 1)}
                  disabled={!pagination.hasNext || usersLoading}
                >
                  <Text style={styles.btnLgText}>Вперед</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.authContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.authScrollContent}
      >
        {!accessToken && !showLogin && !showRegister && (
          <View style={styles.authFormContainer}>
            <TouchableOpacity
              style={styles.authFormButton}
              onPress={() => setShowLogin(true)}
            >
              <Text style={styles.authFormButtonText}>Войти через Backend API</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authFormButton, styles.authButtonBlue]}
              onPress={() => setShowRegister(true)}
            >
              <Text style={styles.authFormButtonText}>Зарегистрироваться через Backend API</Text>
            </TouchableOpacity>
          </View>
        )}
        {renderLoginForm()}
        {renderRegisterForm()}
        {renderProfileCard()}
        {renderUsersSection()}
      </ScrollView>
    </View>
  );
}