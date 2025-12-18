import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Text } from 'react-native';
import { useAuthStore } from '../../stores/auth';
import { styles } from './styles';
import { isValidEmail } from './api';
import { LoginForm, RegisterForm } from './AuthForms';
import { ProfileCard } from './ProfileCard';
import { UsersList } from './UsersList';

export default function Auth() {
  const { 
    user: localUser,
    accessToken,
    profile,
    users,
    usersPagination,
    apiLoading: loading,
    usersLoading,
    apiError: error,
    loginBackend,
    registerBackend,
    loadProfile,
    loadUsers,
    handleLogout,
  } = useAuthStore();
  
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

  useEffect(() => {
    if (accessToken) {
      loadProfile();
      loadUsers();
    }
  }, [accessToken]);

  const onRefresh = async () => {
    if (!accessToken) return;
    setRefreshing(true);
    try {
      await Promise.all([loadProfile(), loadUsers()]);
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

      await loginBackend({ email: loginEmail, password: loginPassword });
      
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
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

      await registerBackend({ 
        email: registerEmail, 
        password: registerPassword,
        name: registerName,
      });
      
      setShowRegister(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
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
          pagination={usersPagination}
          currentPage={currentPage}
          accessToken={accessToken}
          onPreviousPage={() => {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            loadUsers(newPage);
          }}
          onNextPage={() => {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            loadUsers(newPage);
          }}
        />
      </ScrollView>
    </View>
  );
}
