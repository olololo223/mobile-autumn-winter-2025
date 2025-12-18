import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function usePostsController({ accessToken, authApiRequest, profile }) {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [postsOrder, setPostsOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchingById, setSearchingById] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [searchId, setSearchId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [foundPost, setFoundPost] = useState(null);

  const getPostTs = (post) => {
    const updated = post?.updatedAt ? Date.parse(post.updatedAt) : NaN;
    const created = post?.createdAt ? Date.parse(post.createdAt) : NaN;

    if (Number.isFinite(updated) && Number.isFinite(created)) return Math.max(updated, created);
    if (Number.isFinite(updated)) return updated;
    if (Number.isFinite(created)) return created;
    return 0;
  };

  const sortPostsDesc = (list) => {
    const arr = Array.isArray(list) ? [...list] : [];
    arr.sort((a, b) => getPostTs(b) - getPostTs(a));
    return arr;
  };

  const loadPosts = async (page = 1) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      setError(null);

      const requestedUiPage = Math.max(1, Number(page) || 1);

      const fetchPage = async (serverPage) => {
        const queryString = new URLSearchParams({
          page: String(serverPage),
          limit: '10',
        }).toString();
        return authApiRequest(`/posts?${queryString}`, { method: 'GET' });
      };

      const cachedTotalPages = Number(pagination?.totalPages) || null;

      if (postsOrder && cachedTotalPages && requestedUiPage !== 1) {
        const serverPage =
          postsOrder === 'asc'
            ? Math.max(1, cachedTotalPages - requestedUiPage + 1)
            : requestedUiPage;

        const response = await fetchPage(serverPage);
        if (response?.success && response?.data) {
          setPosts(sortPostsDesc(response.data.posts || []));
          setPagination({
            ...response.data.pagination,
            currentPage: requestedUiPage,
            totalPages: cachedTotalPages,
            hasPreviousPage: requestedUiPage > 1,
            hasNextPage: requestedUiPage < cachedTotalPages,
          });
          setCurrentPage(requestedUiPage);
        }
        return;
      }

      const metaResponse = await fetchPage(1);
      if (!(metaResponse?.success && metaResponse?.data)) return;

      const totalPages = Number(metaResponse.data.pagination?.totalPages) || 1;
      const metaPosts = Array.isArray(metaResponse.data.posts)
        ? metaResponse.data.posts
        : [];

      const inferredOrder =
        postsOrder ||
        (metaPosts.length >= 2 &&
        getPostTs(metaPosts[0]) <= getPostTs(metaPosts[metaPosts.length - 1])
          ? 'asc'
          : 'desc');

      if (!postsOrder) setPostsOrder(inferredOrder);

      const serverPage =
        inferredOrder === 'asc'
          ? Math.max(1, totalPages - requestedUiPage + 1)
          : requestedUiPage;

      const response =
        serverPage === 1 ? metaResponse : await fetchPage(serverPage);

      if (response.success && response.data) {
        setPosts(sortPostsDesc(response.data.posts || []));

        setPagination({
          ...response.data.pagination,
          currentPage: requestedUiPage,
          totalPages,
          hasPreviousPage: requestedUiPage > 1,
          hasNextPage: requestedUiPage < totalPages,
        });
        setCurrentPage(requestedUiPage);
      }
    } catch (e) {
      setError(e.message || 'Ошибка загрузки постов');
      console.error('Error loading posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadMyPosts = async () => {
    if (!accessToken) return;
    try {
      setMyPostsLoading(true);
      const response = await authApiRequest('/posts/my', {
        method: 'GET',
      });

      if (response.success && response.data) {
        setMyPosts(sortPostsDesc(response.data.posts || []));
      }
    } catch (e) {
      console.error('Error loading my posts:', e);
    } finally {
      setMyPostsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadPosts();
      loadMyPosts();
    }
  }, [accessToken]);

  const loadPostById = async (id) => {
    if (!accessToken) return;
    const value = String(id || '').trim();
    if (!value) return;

    try {
      setSearchingById(true);
      setError(null);
      const response = await authApiRequest(`/posts/${value}`, {
        method: 'GET',
      });
      const post = response?.data?.post || response?.data || null;
      if (post && post.id) {
        setFoundPost(post);
        return;
      }
      setFoundPost(null);
      Alert.alert('Не найдено', 'Пост с таким id не найден');
    } catch (e) {
      setFoundPost(null);
      Alert.alert('Ошибка', e.message || 'Не удалось найти пост по id');
    } finally {
      setSearchingById(false);
    }
  };

  const resetSearch = () => {
    setSearchId('');
    setSearchText('');
    setFoundPost(null);
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
    setEditingPostId(null);
    setEditTitle('');
    setEditContent('');
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setPostTitle('');
    setPostContent('');
  };

  const handleCreatePost = async (published = true) => {
    if (!accessToken) {
      Alert.alert('Ошибка', 'Необходимо войти в систему');
      return;
    }

    if (!postTitle.trim() || !postContent.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      setCreating(true);
      const response = await authApiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: postTitle.trim(),
          content: postContent.trim(),
          published,
        }),
      });

      if (response.success) {
        setPostTitle('');
        setPostContent('');
        setShowCreateForm(false);
        await Promise.all([loadPosts(1), loadMyPosts()]);
        Alert.alert('Успех', published ? 'Пост опубликован' : 'Пост сохранён как черновик');
      }
    } catch (e) {
      Alert.alert('Ошибка', e.message || 'Не удалось создать пост');
      console.error('Error creating post:', e);
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (post) => {
    if (!post?.id) return;
    setEditingPostId(post.id);
    setEditTitle(String(post.title || ''));
    setEditContent(String(post.content || ''));
    setShowCreateForm(false);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdatePost = async () => {
    if (!accessToken) return;
    const id = String(editingPostId || '').trim();
    if (!id) return;

    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const response = await authApiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });

      const updatedPost = response?.data?.post || response?.data || null;
      if (updatedPost && updatedPost.id) {
        if (foundPost?.id === updatedPost.id) setFoundPost(updatedPost);
      }

      cancelEditing();
      await Promise.all([loadPosts(1), loadMyPosts()]);
      Alert.alert('Успех', 'Пост обновлен');
    } catch (e) {
      Alert.alert('Ошибка', e.message || 'Не удалось обновить пост');
    } finally {
      setUpdating(false);
    }
  };

  const handlePublishPost = async (postId) => {
    if (!accessToken) return;

    try {
      setUpdating(true);
      setError(null);

      const response = await authApiRequest(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          published: true,
        }),
      });

      if (response.success) {
        await Promise.all([loadPosts(1), loadMyPosts()]);
        Alert.alert('Успех', 'Пост опубликован');
      }
    } catch (e) {
      Alert.alert('Ошибка', e.message || 'Не удалось опубликовать пост');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!accessToken) return;

    Alert.alert('Удаление поста', 'Вы уверены, что хотите удалить этот пост?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await authApiRequest(`/posts/${postId}`, {
              method: 'DELETE',
            });
            await Promise.all([loadPosts(1), loadMyPosts()]);
            Alert.alert('Успех', 'Пост удален');
          } catch (e) {
            Alert.alert('Ошибка', e.message || 'Не удалось удалить пост');
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    if (!accessToken) return;
    setRefreshing(true);
    try {
      if (activeTab === 'all') {
        await loadPosts(1);
      } else {
        await loadMyPosts();
      }
    } catch (e) {
      console.error('Refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const allPosts = useMemo(() => {
    const fromAll = Array.isArray(posts) ? posts : [];
    return fromAll;
  }, [posts]);

  const basePosts = activeTab === 'all' ? allPosts : myPosts;
  const filteredPosts = useMemo(() => {
    const list = foundPost ? [foundPost] : basePosts;
    const q = String(searchText || '').trim().toLowerCase();
    if (!q) return list;

    const match = (value) => String(value || '').toLowerCase().includes(q);

    return list.filter((post) => {
      const authorName = post?.author?.name;
      const authorEmail = post?.author?.email;
      const createdAt = post?.createdAt;
      const createdAtRu = createdAt
        ? new Date(createdAt).toLocaleDateString('ru-RU')
        : '';

      return (
        match(post?.id) ||
        match(post?.title) ||
        match(post?.content) ||
        match(authorName) ||
        match(authorEmail) ||
        match(createdAt) ||
        match(createdAtRu) ||
        match(post?.authorId)
      );
    });
  }, [basePosts, foundPost, searchText]);

  const displayPosts = filteredPosts;
  const displayLoading = activeTab === 'all' ? loading : myPostsLoading;
  const isInitialLoading =
    displayLoading &&
    (activeTab === 'all'
      ? posts.length === 0 && myPosts.length === 0
      : myPosts.length === 0);

  const canEditPost = (post) =>
    Boolean(profile && post?.authorId && profile?.id && post.authorId === profile.id);

  return {
    posts,
    myPosts,
    pagination,
    loading,
    myPostsLoading,
    creating,
    updating,
    searchingById,
    refreshing,
    error,
    currentPage,
    activeTab,
    showCreateForm,
    postTitle,
    postContent,
    editingPostId,
    editTitle,
    editContent,
    searchId,
    searchText,
    foundPost,
    displayPosts,
    displayLoading,
    isInitialLoading,

    setActiveTab,
    setShowCreateForm,
    setPostTitle,
    setPostContent,
    setEditTitle,
    setEditContent,
    setSearchId,
    setSearchText,

    loadPosts,
    loadMyPosts,
    loadPostById,
    resetSearch,
    openCreateForm,
    cancelCreate,
    startEditing,
    cancelEditing,
    handleCreatePost,
    handleUpdatePost,
    handlePublishPost,
    handleDeletePost,
    onRefresh,
    canEditPost,
  };
}


