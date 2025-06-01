import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  if (!authStore.getUser && !authStore.getIsAuthenticated) {
    console.log('Auth Init Plugin: Fetching current user...');
    await authStore.fetchCurrentUser();
    console.log('Auth Init Plugin: Fetch current user complete. isAuthenticated:', authStore.getIsAuthenticated);
  } else {
    console.log('Auth Init Plugin: User already loaded or authenticated.');
  }
});