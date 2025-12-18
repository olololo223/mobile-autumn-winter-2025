import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiRequest } from '../components/Auth/api';

const USERS_KEY = 'AUTH_USERS';
const CURRENT_USER_KEY = 'AUTH_CURRENT_USER';
const API_BASE_URL = 'https://cloud.kit-imi.info/api';

const isValidEmail = (value) => {
  const email = String(value).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  accessToken: null,
  refreshToken: null,
  profile: null,
  apiLoading: false,
  apiError: null,
  users: [],
  usersPagination: null,
  usersLoading: false,

  _getUsers: async () => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },
  _setUsers: async (users) => {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  _loadStateFromStorage: async () => {
    try {
      const [usersJson, currentUserJson, accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(USERS_KEY),
        AsyncStorage.getItem(CURRENT_USER_KEY),
        AsyncStorage.getItem('AUTH_ACCESS_TOKEN'),
        AsyncStorage.getItem('AUTH_REFRESH_TOKEN'),
      ]);
      if (!usersJson) {
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify([]));
      }
      const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
      set({ 
        user: currentUser,
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      });
      
      if (accessToken) {
        get().loadProfile();
      }
    } catch (e) {
      console.error('Error loading state from storage:', e);
    }
  },

  refreshAuthToken: async () => {
    try {
      const refreshToken = get().refreshToken || await AsyncStorage.getItem('AUTH_REFRESH_TOKEN');
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
        set({ accessToken: newAccessToken });
        return newAccessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await get().handleLogout();
      throw error;
    }
  },

  authApiRequest: async (url, options = {}, retry = true) => {
    try {
      const token = options.headers?.Authorization?.replace('Bearer ', '') || get().accessToken;
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (response.status === 401 && retry) {
        console.log('Token expired, attempting refresh...');
        const newToken = await get().refreshAuthToken();
        if (newToken) {
          return get().authApiRequest(url, {
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
        await get().handleLogout();
        Alert.alert('Сессия истекла', 'Пожалуйста, войдите снова');
      }
      throw error;
    }
  },

  loadProfile: async () => {
    const token = get().accessToken;
    if (!token) return;
    try {
      set({ apiLoading: true, apiError: null });
      const response = await get().authApiRequest('/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.success && response.data.user) {
        set({ profile: response.data.user });
      }
    } catch (e) {
      set({ apiError: e.message || 'Ошибка загрузки профиля' });
    } finally {
      set({ apiLoading: false });
    }
  },

  loadUsers: async (page = 1) => {
    const token = get().accessToken;
    if (!token) return;
    try {
      set({ usersLoading: true });
      const queryString = new URLSearchParams({ page, limit: 10 }).toString();
      const response = await get().authApiRequest(`/auth/users?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        set({ 
          users: response.data.users,
          usersPagination: response.data.pagination,
        });
      }
    } catch (e) {
      console.error('Error loading users:', e);
      if (e.message.includes('401') || e.message.includes('expired')) {
        set({ apiError: 'Сессия истекла. Войдите снова.' });
      }
    } finally {
      set({ usersLoading: false });
    }
  },

  handleLogout: async () => {
    try {
      await AsyncStorage.multiRemove([
        'AUTH_ACCESS_TOKEN',
        'AUTH_REFRESH_TOKEN',
        'AUTH_USER'
      ]);
      set({ 
        accessToken: null,
        refreshToken: null,
        profile: null,
        users: [],
        usersPagination: null,
        apiError: null,
      });
    } catch (e) {
      console.error('Error during logout:', e);
    }
  },

  loginBackend: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      if (!email || !password) {
        throw new Error('Введите email и пароль');
      }
      if (!isValidEmail(email)) {
        throw new Error('Неверный формат email');
      }

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Ошибка входа');
      }

      const { user, accessToken: token, refreshToken } = response.data;
      await AsyncStorage.setItem('AUTH_ACCESS_TOKEN', token);
      await AsyncStorage.setItem('AUTH_REFRESH_TOKEN', refreshToken || '');
      await AsyncStorage.setItem('AUTH_USER', JSON.stringify(user));
      
      set({ 
        accessToken: token,
        refreshToken: refreshToken || null,
        profile: user,
        isLoading: false,
        error: null,
      });
      
      get().loadUsers();
    } catch (e) {
      set({ isLoading: false, error: e.message || 'Ошибка входа' });
    }
  },

  registerBackend: async ({ email, password, name }) => {
    set({ isLoading: true, error: null });
    try {
      if (!email || !password) {
        throw new Error('Заполните все поля');
      }
      if (!isValidEmail(email)) {
        throw new Error('Неверный формат email');
      }

      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password,
          name: name?.trim() || undefined,
        }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Ошибка регистрации');
      }

      const { user, accessToken: token, refreshToken } = response.data;
      await AsyncStorage.setItem('AUTH_ACCESS_TOKEN', token);
      await AsyncStorage.setItem('AUTH_REFRESH_TOKEN', refreshToken || '');
      await AsyncStorage.setItem('AUTH_USER', JSON.stringify(user));
      
      set({ 
        accessToken: token,
        refreshToken: refreshToken || null,
        profile: user,
        isLoading: false,
        error: null,
      });
      
      get().loadUsers();
    } catch (e) {
      set({ isLoading: false, error: e.message || 'Ошибка регистрации' });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      if (!email || !password) {
        throw new Error('Введите email и пароль');
      }
      if (!isValidEmail(email)) {
        throw new Error('Неверный формат email');
      }
      const normalizedEmail = String(email).trim().toLowerCase();
      const users = await get()._getUsers();
      const found = users.find((u) => u.email === normalizedEmail && 
                                      u.password === password);
      if (!found) {
        throw new Error('Неверный email или пароль');
      }
      const currentUser = { id: found.id, email: found.email };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      set({ user: currentUser, isLoading: false, error: null });
    } catch (e) {
      set({ isLoading: false, error: e.message || 'Ошибка входа' });
    }
  },

  register: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      if (!email || !password) {
        throw new Error('Заполните все поля');
      }
      if (!isValidEmail(email)) {
        throw new Error('Неверный формат email');
      }
      const normalizedEmail = String(email).trim().toLowerCase();
      const users = await get()._getUsers();
      const exists = users.some((u) => u.email === normalizedEmail);
      if (exists) {
        throw new Error('Пользователь с таким email уже существует');
      }
      const newUser = { id: Crypto.randomUUID(), email: normalizedEmail, password };
      const nextUsers = [...users, newUser];
      await get()._setUsers(nextUsers);
      const currentUser = { id: newUser.id, email: newUser.email };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      set({ user: currentUser, isLoading: false, error: null });
    } catch (e) {
      set({ isLoading: false, error: e.message || 'Ошибка регистрации' });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      set({ user: null });
    }
  },
}));

useAuthStore.getState()._loadStateFromStorage();

