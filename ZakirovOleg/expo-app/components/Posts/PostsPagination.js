import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export function PostsPagination({ pagination, loading, onPrev, onNext }) {
  if (!pagination) return null;

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          (!pagination.hasPreviousPage || loading) && styles.paginationButtonDisabled,
        ]}
        onPress={onPrev}
        disabled={!pagination.hasPreviousPage || loading}
      >
        <Text style={styles.paginationButtonText}>Назад</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>
        Страница {pagination.currentPage} из {pagination.totalPages}
      </Text>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          (!pagination.hasNextPage || loading) && styles.paginationButtonDisabled,
        ]}
        onPress={onNext}
        disabled={!pagination.hasNextPage || loading}
      >
        <Text style={styles.paginationButtonText}>Вперед</Text>
      </TouchableOpacity>
    </View>
  );
}


