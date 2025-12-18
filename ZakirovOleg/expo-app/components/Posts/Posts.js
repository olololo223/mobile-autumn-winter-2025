import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useAuthStore } from '../../stores/auth';
import { styles } from './styles';
import { usePostsController } from './usePostsController';
import { PostsTabs } from './PostsTabs';
import { PostsSearch } from './PostsSearch';
import { PostForm } from './PostForm';
import { PostCard } from './PostCard';
import { PostsPagination } from './PostsPagination';

export default function Posts() {
  const { accessToken, authApiRequest, profile } = useAuthStore();

  const c = usePostsController({ accessToken, authApiRequest, profile });

  return (
    <View style={styles.postsContainer}>
      {!accessToken ? (
        <View style={styles.notAuthContainer}>
          <Text style={styles.notAuthText}>
            Войдите в систему для просмотра постов
          </Text>
        </View>
      ) : (
        <>
          <PostsTabs activeTab={c.activeTab} onChange={c.setActiveTab} />

          <PostsSearch
            searchId={c.searchId}
            onSearchIdChange={c.setSearchId}
            searchingById={c.searchingById}
            onSearchById={() => c.loadPostById(c.searchId)}
            searchText={c.searchText}
            onSearchTextChange={c.setSearchText}
            onReset={c.resetSearch}
            canReset={Boolean(c.searchId || c.searchText || c.foundPost)}
          />

          {c.editingPostId ? (
            <PostForm
              title="Редактировать пост"
              submitLabel="Сохранить"
              loading={c.updating}
              onSubmit={c.handleUpdatePost}
              onCancel={c.cancelEditing}
              postTitle={c.editTitle}
              postContent={c.editContent}
              onTitleChange={c.setEditTitle}
              onContentChange={c.setEditContent}
            />
          ) : c.showCreateForm ? (
            <PostForm
              title="Создать новый пост"
              submitLabel="Опубликовать"
              draftLabel="Сохранить как черновик"
              loading={c.creating}
              onSubmit={() => c.handleCreatePost(true)}
              onSubmitDraft={() => c.handleCreatePost(false)}
              onCancel={c.cancelCreate}
              postTitle={c.postTitle}
              postContent={c.postContent}
              onTitleChange={c.setPostTitle}
              onContentChange={c.setPostContent}
            />
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={c.openCreateForm}>
              <Text style={styles.createButtonText}>+ Создать пост</Text>
            </TouchableOpacity>
          )}

          {c.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{c.error}</Text>
            </View>
          )}

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={c.refreshing} onRefresh={c.onRefresh} />
            }
            contentContainerStyle={styles.postsScrollContent}
          >
            {c.isInitialLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Загрузка постов...</Text>
              </View>
            ) : c.displayPosts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {c.activeTab === 'all' ? 'Нет постов' : 'У вас пока нет постов'}
                </Text>
              </View>
            ) : (
              c.displayPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canEdit={c.canEditPost(post)}
                  onEdit={() => c.startEditing(post)}
                  onDelete={() => c.handleDeletePost(post.id)}
                  onPublish={() => c.handlePublishPost(post.id)}
                />
              ))
            )}

            {c.activeTab === 'all' && (
              <PostsPagination
                pagination={c.pagination}
                loading={c.loading}
                onPrev={() => c.loadPosts(c.currentPage - 1)}
                onNext={() => c.loadPosts(c.currentPage + 1)}
              />
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}


