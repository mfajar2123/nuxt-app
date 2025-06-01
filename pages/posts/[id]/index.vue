<template>
  <div class="container post-detail-page">
    <div v-if="postStore.isLoading && !post" class="loading-state">Memuat post...</div>
    <div v-else-if="postStore.getError && !post" class="error-message">
      <p>Error: {{ postStore.getError }}</p>
      <NuxtLink to="/posts" class="btn btn-secondary mt-2">Kembali ke Daftar Posts</NuxtLink>
    </div>
    <div v-else-if="post" class="card post-content-card">
      <div class="card-body">
        <h1 class="card-title post-title">{{ post.title }}</h1>
        <p class="text-muted post-meta">
          <small>
            Diterbitkan: {{ new Date(post.createdAt).toLocaleString() }}
            <span v-if="post.updatedAt && new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime()">
              | Diperbarui: {{ new Date(post.updatedAt).toLocaleString() }}
            </span>
            <span v-if="post.user"> | Oleh: {{ post.user.name || post.user.email }}</span>
          </small>
        </p>
        <hr>
        <div class="post-content-body" v-html="sanitizedHtmlContent"></div>
      </div>
      <div class="card-footer post-actions-footer">
        <NuxtLink to="/posts" class="btn btn-secondary btn-sm">Kembali ke Daftar</NuxtLink>
        <template v-if="authStore.getIsAuthenticated && authStore.getUser?.id === post.userId">
          <NuxtLink :to="`/posts/${post.id}/edit`" class="btn btn-warning btn-sm ml-1">Edit Post</NuxtLink>
          <button @click="handleDeletePost" class="btn btn-danger btn-sm ml-1" :disabled="isDeleting">
             {{ isDeleting ? 'Menghapus...' : 'Hapus Post' }}
           </button>
        </template>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>Postingan tidak ditemukan.</p>
      <NuxtLink to="/posts" class="btn btn-secondary mt-2">Kembali ke Daftar Posts</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostStore, type Post as PostType } from '~/store/postStore';
import { useAuthStore } from '~/store/authStore';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface PostWithUser extends PostType {
  user: {
    id: number;
    name?: string | null;
    email: string;
  } | null;
}

const postStore = usePostStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const postId = computed(() => Number(route.params.id));

const post = computed<PostWithUser | null>(() => postStore.getCurrentPost as PostWithUser | null);
const sanitizedHtmlContent = ref('');
const isDeleting = ref(false);


async function loadPost() {
  if (isNaN(postId.value)) {
    console.error("Invalid post ID from route");
    return navigateTo('/404', { replace: true });
  }
  const fetchedPost = await postStore.fetchPostById(postId.value);
  if (fetchedPost && fetchedPost.content) {
    
    renderAndSanitizeMarkdown(fetchedPost.content);
  } else if (!fetchedPost && !postStore.isLoading) {
  
    sanitizedHtmlContent.value = '<p>Konten tidak tersedia.</p>';
  }
}

function renderAndSanitizeMarkdown(content: string) {
  if (typeof window !== 'undefined') { 
    const rawHtml = marked.parse(content, { gfm: true, breaks: true });
    sanitizedHtmlContent.value = DOMPurify.sanitize(rawHtml as string);
  } else {
    
    sanitizedHtmlContent.value = "Konten sedang diproses..."; 
  }
}

onMounted(loadPost);

watch(postId, (newId) => {
  if (!isNaN(newId)) {
    loadPost();
  }
});


watch(() => post.value?.content, (newContent) => {
  if (newContent) {
    renderAndSanitizeMarkdown(newContent);
  } else if(post.value && !newContent) { 
    sanitizedHtmlContent.value = '';
  }
});

async function handleDeletePost() {
  if (!post.value) return;
  if (confirm('Anda yakin ingin menghapus post ini secara permanen?')) {
    isDeleting.value = true;
    const success = await postStore.deletePost(post.value.id);
    if (success) {
      console.log('Post berhasil dihapus');
      router.push('/posts');
    } else {
      alert('Gagal menghapus post: ' + (postStore.getError || 'Terjadi kesalahan.'));
    }
    isDeleting.value = false;
  }
}


// Meta Tags Dinamis
watch(post, (currentPostValue) => {
  if (currentPostValue) {
    const description = currentPostValue.content ? currentPostValue.content.substring(0, 160) + '...' : 'Baca selengkapnya...';
    useHead({
      title: `${currentPostValue.title} - Aplikasi Saya`,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: currentPostValue.title },
        { property: 'og:description', content: description },
      ]
    });
  } else if (!postStore.isLoading && postStore.getError) {
     useHead({
      title: 'Error - Post Tidak Ditemukan',
      meta: [ { name: 'description', content: 'Post yang Anda cari tidak ditemukan.' } ]
    });
  }
}, { immediate: true, deep: true }); 
</script>

<style scoped>
.post-detail-page {
  padding-top: 1rem;
  max-width: 860px; 
}
.loading-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-muted);
}

.post-title {
  font-size: 2.2rem; /* Judul lebih besar */
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.post-meta {
  font-size: 0.9em;
  margin-bottom: 1.5rem;
}
.post-content-body {
  line-height: 1.7; /* Spasi baris lebih nyaman untuk dibaca */
  font-size: 1.05rem; /* Ukuran font konten sedikit lebih besar */
}
.post-content-body :deep(p) {
  margin-bottom: 1.25em;
}
.post-content-body :deep(h2) {
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 0.75em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.25em;
}
.post-content-body :deep(h3) {
  font-size: 1.25em;
  margin-top: 1.75em;
  margin-bottom: 0.5em;
}
.post-content-body :deep(ul),
.post-content-body :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}
.post-content-body :deep(blockquote) {
  margin-left: 0;
  padding-left: 1em;
  border-left: 3px solid var(--medium-gray);
  color: var(--text-color-muted);
  font-style: italic;
}
.post-content-body :deep(code) {
  background-color: var(--light-gray);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}
.post-content-body :deep(pre) {
  background-color: var(--dark-gray);
  color: var(--light-gray);
  padding: 1em;
  border-radius: var(--border-radius);
  overflow-x: auto; /* Agar bisa scroll jika kode panjang */
}
.post-content-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}
.post-actions-footer {
  display: flex;
  justify-content: flex-start; /* Tombol di kiri */
  align-items: center;
  gap: 0.5rem; /* Jarak antar tombol */
}
.ml-1 { margin-left: 0.5rem !important; }
</style>