<template>
  <div>
    <header class="site-header">
      <div class="container nav-container">
        <NuxtLink to="/" class="nav-brand">AppCRUD</NuxtLink>
        <nav class="site-nav">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/posts" class="nav-link">Posts</NuxtLink>
          <template v-if="authStore.getIsAuthenticated">
            <NuxtLink v-if="authStore.getUser" :to="`/profile/${authStore.getUser.id}`" class="nav-link">
              Hi, {{ authStore.getUser.name || authStore.getUser.email }}
            </NuxtLink>
            <button @click="handleLogout" class="nav-link logout-button">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="nav-link">Login</NuxtLink>
            <NuxtLink to="/auth/register" class="nav-link">Register</NuxtLink>
          </template>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <slot />
    </main>
    <footer class="site-footer-bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Aplikasi CRUD Nuxt Drizzle. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/authStore';
const authStore = useAuthStore();

async function handleLogout() {
  await authStore.logout();
}
</script>

<style scoped>
.site-header {
  background-color: var(--dark-gray);
  padding: 1rem 0;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky; /* Membuat header tetap di atas saat scroll */
  top: 0;
  z-index: 1000; /* Memastikan di atas konten lain */
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}
.nav-brand:hover {
  color: #f0f0f0;
}

.site-nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #e0e0e0;
  margin-left: 1.5rem; /* Jarak antar link */
  text-decoration: none;
  padding: 0.5rem 0; /* Padding vertikal untuk area klik yang lebih baik */
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active, /* Style untuk link aktif */
.nav-link.router-link-exact-active {
  color: #fff;
  /* border-bottom: 2px solid var(--primary-color); */
  text-decoration: none; /* Hapus underline default, kita bisa kustom jika mau */
}

.logout-button {
  background: none;
  border: none;
  color: #e0e0e0; /* Sama dengan nav-link */
  cursor: pointer;
  padding: 0.5rem 0;
  font: inherit;
  font-size: 1rem; /* Samakan dengan nav-link */
  margin-left: 1.5rem;
  transition: color 0.2s ease;
}

.logout-button:hover {
  color: #fff;
}

.main-content {
  padding-top: 2rem; /* Memberi jarak dari header */
  padding-bottom: 2rem;
  /* Konten akan ada di dalam .container dari masing-masing halaman */
}

.site-footer-bottom {
  text-align: center;
  padding: 1.5rem 0;
  margin-top: 2rem;
  background-color: var(--medium-gray);
  color: var(--text-color-muted);
  font-size: 0.9em;
  border-top: 1px solid var(--border-color);
}
</style>