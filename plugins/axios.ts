import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { useAuthStore } from '~/store/authStore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api: AxiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true, 
  });

  // Interceptor Request
  api.interceptors.request.use(
    (config) => {
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor Response
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const authStore = useAuthStore();
      const originalRequestUrl = error.config?.url;

      if (error.response?.status === 401) {
        console.warn('Axios Interceptor: Received 401 Unauthorized');

       
        if (originalRequestUrl !== '/auth/me' && originalRequestUrl !== '/auth/login') {
          if (authStore.isAuthenticated) {
            console.log('Axios Interceptor: Logging out due to 401 on protected route');
            await authStore.logout(); 
          } else {
            
            if (originalRequestUrl !== '/auth/me' && import.meta.client) {
              const router = useRouter();
              router.push('/auth/login');
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );

  // Inject ke Nuxt
  nuxtApp.provide('api', api);
});
