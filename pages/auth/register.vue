<template>
  <div class="auth-page">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="name">Nama (Opsional):</label>
        <input type="text" id="name" v-model="name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
       <div>
        <label for="confirmPassword">Konfirmasi Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <button type="submit" :disabled="authStore.getLoading">
        {{ authStore.getLoading ? 'Registering...' : 'Register' }}
      </button>
      <p v-if="authStore.getError" class="error-message">{{ authStore.getError }}</p>
       <p v-if="clientError" class="error-message">{{ clientError }}</p>
    </form>
    <p>Sudah punya akun? <NuxtLink to="/auth/login">Login di sini</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">

import { useAuthStore } from '~/store/authStore';

definePageMeta({
  middleware: ['guest'] // Gunakan middleware guest
});

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const clientError = ref('');

async function handleRegister() {
  clientError.value = ''; 
  if (password.value !== confirmPassword.value) {
    clientError.value = 'Password dan konfirmasi password tidak cocok.';
    return;
  }
  const success = await authStore.register({
    name: name.value || undefined, 
    email: email.value,
    password: password.value
  });
  if (success) {
    
    router.push('/auth/login?registered=true');
  }
}

useHead({
  title: 'Register - Aplikasi Saya',
  meta: [
    {
      name: 'description',
      content: 'Daftar akun di Aplikasi Saya untuk mulai mengelola postingan dengan mudah dan aman.'
    }
  ]
});

</script>

<style scoped>

.auth-page { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
.error-message { color: red; margin-top: 10px; }
div { margin-bottom: 10px; }
label { display: block; margin-bottom: 5px; }
input { width: 100%; padding: 8px; box-sizing: border-box; }
button { padding: 10px 15px; background-color: #28a745; color: white; border: none; cursor: pointer; }
button:disabled { background-color: #aaa; }
</style>