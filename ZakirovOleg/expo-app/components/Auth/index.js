import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../stores/auth';
import { styles } from './styles';
import { apiRequest, isValidEmail } from './api';
import { LoginForm, RegisterForm } from './AuthForms';
import { ProfileCard } from './ProfileCard';
import { UsersList } from './UsersList';

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
      await handleLogout();
      throw error;
    }
  };

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

  const authApiRequest = async (url, options = {}, retry = true) => {
    try {
      const token = options.headers?.Authorization?.replace('Bearer ', '') || accessToken;
      
      const response = await fetch(`https://cloud.kit-imi.info/api${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (response.status === 401 && retry) {
        console.log('Token expired, attempting refresh...');
        const newToken = await refreshAuthToken();
        if (newToken) {
          return authApiRequest(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          }, false);
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
      
      loadUsers(token);
    } catch (e) {
      setAuthError(e.message || 'Ошибка регистрации');
    } finally {
      setAuthLoading(false);
    }
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
        <LoginForm
          show={showLogin}
          email={loginEmail}
          password={loginPassword}
          error={authError}
          loading={authLoading}
          onEmailChange={setLoginEmail}
          onPasswordChange={setLoginPassword}
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
            setAuthError(null);
          }}
        />
        <RegisterForm
          show={showRegister}
          name={registerName}
          email={registerEmail}
          password={registerPassword}
          error={authError}
          loading={authLoading}
          onNameChange={setRegisterName}
          onEmailChange={setRegisterEmail}
          onPasswordChange={setRegisterPassword}
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
            setAuthError(null);
          }}
        />
        <ProfileCard
          profile={profile}
          loading={loading}
          error={error}
          onRetry={() => loadProfile()}
          onLogout={handleLogout}
        />
        <UsersList
          users={users}
          loading={usersLoading}
          pagination={pagination}
          currentPage={currentPage}
          accessToken={accessToken}
          onPreviousPage={() => loadUsers(accessToken, currentPage - 1)}
          onNextPage={() => loadUsers(accessToken, currentPage + 1)}
        />
      </ScrollView>
    </View>
  );
}
