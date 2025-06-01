<template>
  <div class="container posts-page">
    <div class="page-header">
      <h1>Daftar Postingan</h1>
      <NuxtLink v-if="authStore.getIsAuthenticated" to="/posts/create" class="btn btn-primary">
        Buat Post Baru
      </NuxtLink>
    </div>

    <!-- Input Pencarian -->
    <div class="search-bar mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari postingan..."
        class="form-control"
      />
    </div>

    <!-- Loading State -->
    <div v-if="postStore.isLoading" class="loading-state">Memuat posts...</div>

    <!-- Error State -->
    <div v-else-if="postStore.getError" class="error-message">
      Error: {{ postStore.getError }}
    </div>

    <!-- Daftar Post Sesuai Filter -->
    <div v-else-if="filteredPosts.length > 0" class="posts-list">
      <div v-for="post in filteredPosts" :key="post.id" class="card post-item">
        <div class="card-body">
          <h2 class="card-title">
            <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
          </h2>
          <p class="card-text text-muted post-meta">
            <small>Dibuat: {{ new Date(post.createdAt).toLocaleDateString() }}</small>
          </p>
          <p class="card-text">{{ truncate(post.content, 120) }}</p>

          <!-- Tombol Aksi -->
          <div
            class="post-actions mt-2"
            v-if="authStore.getIsAuthenticated && authStore.getUser?.id === post.userId"
          >
            <NuxtLink :to="`/posts/${post.id}/edit`" class="btn btn-warning btn-sm mr-1">Edit</NuxtLink>
            <button @click="handleDelete(post.id)" class="btn btn-danger btn-sm" :disabled="postStore.isLoading">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- State Kosong -->
    <div v-else class="empty-state">
      <p v-if="searchQuery">Tidak ada postingan yang cocok dengan pencarian.</p>
      <p v-else>Tidak ada postingan yang tersedia saat ini.</p>
      <NuxtLink v-if="authStore.getIsAuthenticated" to="/posts/create" class="btn btn-secondary mt-2">
        Jadilah yang pertama membuat post!
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePostStore, type Post as PostType } from '~/store/postStore';
import { useAuthStore } from '~/store/authStore';

definePageMeta({
  middleware: ['auth']
});

const postStore = usePostStore();
const authStore = useAuthStore();


const posts = computed(() => postStore.getPosts);


const searchQuery = ref('');


const filteredPosts = computed(() =>
  posts.value.filter(post =>
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);


onMounted(() => {
  if (!postStore.getPosts.length) {
    postStore.fetchPosts(); 
  }
});


async function handleDelete(id: number) {
  if (confirm('Anda yakin ingin menghapus post ini?')) {
    const success = await postStore.deletePost(id);
    if (!success) {
      alert('Gagal menghapus post: ' + (postStore.getError || 'Terjadi kesalahan.'));
    }
  }
}


function truncate(text: string, length: number) {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}


useHead({
  title: 'Daftar Posts - Aplikasi Saya',
  meta: [
    { name: 'description', content: 'Lihat dan cari semua postingan terbaru di situs kami.' }
  ]
});
</script>

<style scoped>
.posts-page {
  padding-top: 1rem;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.loading-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-muted);
}
.posts-list {
  display: grid;
  gap: 1.5rem;
}
.post-item.card {
  transition: box-shadow 0.2s ease-in-out;
}
.post-item.card:hover {
  box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1);
}
.post-item .card-title a {
  color: var(--dark-gray);
  text-decoration: none;
}
.post-item .card-title a:hover {
  color: var(--primary-color);
}
.post-meta {
  font-size: 0.85em;
  margin-bottom: 0.75rem;
}
.post-actions .btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
.mr-1 {
  margin-right: 0.5rem !important;
}
.search-bar input {
  max-width: 400px;
  margin: 0 auto;
  display: block;
}
</style>
