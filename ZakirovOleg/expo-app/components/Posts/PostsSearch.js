import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styles';

export function PostsSearch({
  searchId,
  onSearchIdChange,
  searchingById,
  onSearchById,
  searchText,
  onSearchTextChange,
  onReset,
  canReset,
}) {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchTitle}>Поиск</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по id"
          value={searchId}
          onChangeText={onSearchIdChange}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchById}
          disabled={searchingById || !String(searchId || '').trim()}
        >
          {searchingById ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Найти</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Фильтр: автор, дата, текст, id..."
          value={searchText}
          onChangeText={onSearchTextChange}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.searchButton, styles.searchButtonSecondary]}
          onPress={onReset}
          disabled={!canReset}
        >
          <Text
            style={[styles.searchButtonText, styles.searchButtonTextSecondary]}
          >
            Сброс
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


