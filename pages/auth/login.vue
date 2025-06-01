<template>
  <div class="auth-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="authStore.getLoading">
        {{ authStore.getLoading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="authStore.getError" class="error-message">{{ authStore.getError }}</p>
    </form>
    <p>Belum punya akun? <NuxtLink to="/auth/register">Register di sini</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/authStore';

definePageMeta({
  middleware: ['guest'] // Gunakan middleware guest
});

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');

async function handleLogin() {
  const success = await authStore.login({ email: email.value, password: password.value });
  if (success) {
    // Redirect ke halaman yang dituju sebelumnya, atau ke /posts
    const redirectPath = route.query.redirect as string || '/posts';
    router.push(redirectPath);
  }
}

useHead({
  title: 'Login - Aplikasi Saya'
});
</script>

<style scoped>
.auth-page { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
.error-message { color: red; margin-top: 10px; }
div { margin-bottom: 10px; }
label { display: block; margin-bottom: 5px; }
input { width: 100%; padding: 8px; box-sizing: border-box; }
button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; }
button:disabled { background-color: #aaa; }
</style>