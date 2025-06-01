import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type AxiosError, type AxiosInstance } from 'axios';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const usePostStore = defineStore('post', () => {
  // =======================
  // State
  // =======================
  const posts = ref<Post[]>([]);
  const currentPost = ref<Post | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // =======================
  // API Instance
  // =======================
  const nuxtApp = useNuxtApp();
  const $api = nuxtApp.$api as AxiosInstance;

  // =======================
  // Getters
  // =======================
  const getPosts = computed(() => posts.value);
  const getCurrentPost = computed(() => currentPost.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // =======================
  // Helper
  // =======================
  const handleAxiosError = (e: unknown, defaultMessage: string) => {
    if (import.meta.client) console.error(e);
    else console.error('[SSR Error]', e);

    if (
      typeof e === 'object' &&
      e !== null &&
      'isAxiosError' in e &&
      (e as any).isAxiosError
    ) {
      const axiosError = e as AxiosError<any>;
      error.value =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.statusMessage ||
        axiosError.response?.data?.data?.[0]?.message ||
        axiosError.message ||
        defaultMessage;
    } else if (e instanceof Error) {
      error.value = e.message || defaultMessage;
    } else {
      error.value = defaultMessage;
    }
  };

  // =======================
  // Actions
  // =======================
  async function fetchPosts() {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api.get<Post[]>('/posts');
      posts.value = response.data;
    } catch (e: unknown) {
      handleAxiosError(e, 'Failed to fetch posts');
    } finally {
      loading.value = false;
    }
  }

  async function fetchPostById(id: number) {
    loading.value = true;
    error.value = null;
    currentPost.value = null;

    try {
      const response = await $api.get<Post>(`/posts/${id}`);
      currentPost.value = response.data;
      return response.data;
    } catch (e: unknown) {
      handleAxiosError(e, `Failed to fetch post ${id}`);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createPost(postData: { title: string; content: string }) {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api.post<Post>('/posts', postData);
      posts.value.unshift(response.data);
      return response.data;
    } catch (e: unknown) {
      handleAxiosError(e, 'Failed to create post');
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updatePost(id: number, postData: { title?: string; content?: string }) {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api.put<Post>(`/posts/${id}`, postData);
      const updatedPost = response.data;

      const index = posts.value.findIndex(p => p.id === id);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      if (currentPost.value && currentPost.value.id === id) {
        currentPost.value = updatedPost;
      }

      return updatedPost;
    } catch (e: unknown) {
      handleAxiosError(e, 'Failed to update post');
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deletePost(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await $api.delete(`/posts/${id}`);
      posts.value = posts.value.filter(p => p.id !== id);

      if (currentPost.value && currentPost.value.id === id) {
        currentPost.value = null;
      }

      return true;
    } catch (e: unknown) {
      handleAxiosError(e, 'Failed to delete post');
      return false;
    } finally {
      loading.value = false;
    }
  }

  // =======================
  // Return store
  // =======================
  return {
    posts,
    currentPost,
    loading,
    error,
    getPosts,
    getCurrentPost,
    isLoading,
    getError,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  };
});
