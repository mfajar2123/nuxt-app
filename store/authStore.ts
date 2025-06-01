import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AxiosInstance, AxiosError } from 'axios';

export interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
  createdAt?: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends Credentials {
  name?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null);
  const isAuthenticated = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // API Instance
  const nuxtApp = useNuxtApp();
  const $api = nuxtApp.$api as AxiosInstance;

  // Getters
  const getUser = computed(() => user.value);
  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // Error Handler
  const handleAuthError = (e: unknown, defaultMessage: string) => {
    if (import.meta.client) console.error('Auth Error:', e);
    else console.error('[SSR Auth Error]', e);

    let message = defaultMessage;

    if (
      typeof e === 'object' &&
      e !== null &&
      'isAxiosError' in e &&
      (e as any).isAxiosError
    ) {
      const axiosError = e as AxiosError<any>;
      message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.statusMessage ||
        axiosError.response?.data?.data?.[0]?.message ||
        axiosError.message ||
        defaultMessage;
    } else if (e instanceof Error) {
      message = e.message || defaultMessage;
    }

    error.value = message;
    isAuthenticated.value = false;
    user.value = null;
  };

  // Actions
  const login = async (credentials: Credentials): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api.post<{ message: string; user: AuthUser }>(
        '/auth/login',
        credentials
      );
      user.value = response.data.user;
      isAuthenticated.value = true;
      return true;
    } catch (e: unknown) {
      handleAuthError(e, 'Login gagal.');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await $api.post('/auth/register', credentials);
      return true;
    } catch (e: unknown) {
      handleAuthError(e, 'Registrasi gagal.');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await $api.post('/auth/logout');
    } catch (e: unknown) {
      handleAuthError(e, 'Logout API call failed, but logging out client-side.');
    } finally {
      user.value = null;
      isAuthenticated.value = false;
      loading.value = false;

      if (import.meta.client) {
        const router = useRouter();
        router.push('/auth/login');
      }
    }
  };

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const response = await $api.get<AuthUser>('/auth/me');
      user.value = response.data;
      isAuthenticated.value = true;
      error.value = null;
    } catch (e: unknown) {
      user.value = null;
      isAuthenticated.value = false;
    }
  };

  // Return
  return {
    user,
    isAuthenticated,
    loading,
    error,
    getUser,
    getIsAuthenticated,
    getLoading,
    getError,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
});
