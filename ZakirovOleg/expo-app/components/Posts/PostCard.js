import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export function PostCard({ post, canEdit, onEdit, onDelete, onPublish }) {
  const createdAtMs = post?.createdAt ? Date.parse(post.createdAt) : NaN;
  const updatedAtMs = post?.updatedAt ? Date.parse(post.updatedAt) : NaN;

  const hasUpdated =
    Number.isFinite(updatedAtMs) &&
    (!Number.isFinite(createdAtMs) || updatedAtMs > createdAtMs);

  const dateLabel = hasUpdated ? 'Обновлено' : 'Создано';
  const dateValue = hasUpdated ? post?.updatedAt : post?.createdAt;
  const dateText = dateValue ? new Date(dateValue).toLocaleDateString('ru-RU') : '';

  return (
    <View style={styles.postCard}>
      {!post.published && (
        <View style={styles.draftBadge}>
          <Text style={styles.draftBadgeText}>Черновик</Text>
        </View>
      )}
      <View style={styles.postHeader}>
        <Text style={styles.postTitle} selectable>{post.title}</Text>
        {canEdit ? (
          <View style={styles.postActions}>
            {!post.published && (
              <TouchableOpacity style={styles.publishButton} onPress={onPublish}>
                <Text style={styles.publishButtonText}>Опубл.</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Text style={styles.actionButtonText}>Правка</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={onDelete}
            >
              <Text
                style={[styles.actionButtonText, styles.actionButtonTextDanger]}
              >
                Удалить
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <View style={styles.postMeta}>
        <Text style={styles.postId} selectable>ID: {post.id}</Text>
      </View>

      <Text style={styles.postContent} selectable>{post.content}</Text>

      <View style={styles.postFooter}>
        <Text style={styles.postAuthor} selectable>
          Автор: {post.author?.name || post.author?.email || 'Неизвестно'}
        </Text>
        <Text style={styles.postDate} selectable>
          {dateText ? `${dateLabel}: ${dateText}` : ''}
        </Text>
      </View>
    </View>
  );
}


