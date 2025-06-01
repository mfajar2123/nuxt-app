import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const authStore = useAuthStore();
  
    if (!authStore.getIsAuthenticated && !authStore.getUser) {
      await authStore.fetchCurrentUser();
    }

    if (authStore.getIsAuthenticated) {
      console.log('Guest Middleware: Authenticated, redirecting from guest page.');
      return navigateTo('/posts', { replace: true }); 
    }
    console.log('Guest Middleware: Not authenticated, allowing access to guest page.');
  }
});