import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './styles';

function UserItem({ item }) {
  return (
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
}

export function UsersList({ 
  users, 
  loading, 
  pagination, 
  currentPage, 
  accessToken, 
  onPreviousPage, 
  onNextPage 
}) {
  if (!accessToken) return null;

  return (
    <View style={styles.authSection}>
      <Text style={styles.authSectionTitle}>Пользователи</Text>
      {loading && users.length === 0 ? (
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
                <UserItem item={item} />
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
                onPress={onPreviousPage}
                disabled={!pagination.hasPrev || loading}
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
                onPress={onNextPage}
                disabled={!pagination.hasNext || loading}
              >
                <Text style={styles.btnLgText}>Вперед</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
