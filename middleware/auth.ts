import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
 
  if (import.meta.client) {
    const authStore = useAuthStore();

    if (!authStore.getIsAuthenticated && !authStore.getUser) {
      console.log('Auth Middleware: User not loaded, fetching...');
      await authStore.fetchCurrentUser(); 
    }

    if (!authStore.getIsAuthenticated) {
      console.log('Auth Middleware: Not authenticated, redirecting to login.');
  
      const intendedPath = (to.fullPath !== '/auth/login' && to.fullPath !== '/auth/register') ? to.fullPath : '/posts';
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(intendedPath)}`, { replace: true });
    }
    console.log('Auth Middleware: Authenticated.');
  }

});