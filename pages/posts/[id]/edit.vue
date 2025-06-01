<template>
  <div class="container edit-post-page">
    <div class="page-header">
      <h1>Edit Postingan</h1>
      <NuxtLink
        v-if="postStore.getCurrentPost"
        :to="`/posts/${postStore.getCurrentPost.id}`"
        class="btn btn-secondary"
      >
        Batal & Kembali ke Post
      </NuxtLink>
      <NuxtLink v-else to="/posts" class="btn btn-secondary">
        Kembali ke Daftar
      </NuxtLink>
    </div>

    <div v-if="postStore.isLoading && !initialDataLoaded" class="loading-state">
      Memuat data post...
    </div>

    <div v-else-if="pageError" class="error-message">
      <p>{{ pageError }}</p>
      <NuxtLink to="/posts" class="btn btn-secondary mt-2">Kembali ke Daftar Posts</NuxtLink>
    </div>

    <div
      v-else-if="initialDataLoaded && postStore.getCurrentPost"
      class="card"
    >
      <div class="card-body">
        <PostForm
          :initial-data="postStore.getCurrentPost"
          :is-editing="true"
          :is-loading="postStore.isLoading"
          :api-error="postStore.getError"
          @submit="handleSubmit"
        />
      </div>
    </div>

    <div
      v-else-if="!postStore.isLoading && !postStore.getCurrentPost"
      class="empty-state"
    >
      <p>Postingan tidak ditemukan atau gagal dimuat untuk diedit.</p>
      <NuxtLink to="/posts" class="btn btn-secondary mt-2">Kembali ke Daftar Posts</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from '~/store/postStore';

definePageMeta({
  middleware: ['auth'],
});

const postStore = usePostStore();
const route = useRoute();
const router = useRouter();

const postId = computed(() => {
  const idParam = route.params.id;
  return Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);
});

const initialDataLoaded = ref(false);
const pageError = ref<string | null>(null);

async function loadPostForEdit() {
  pageError.value = null;
  initialDataLoaded.value = false;

  if (isNaN(postId.value)) {
    console.error("ID post tidak valid:", route.params.id);
    pageError.value = "ID post tidak valid.";
    await navigateTo('/404', { replace: true });
    return;
  }

  const currentPost = postStore.getCurrentPost;
  if (
    !currentPost ||
    currentPost.id !== postId.value ||
    postStore.getError
  ) {
    await postStore.fetchPostById(postId.value);
  }

  if (postStore.getError) {
    pageError.value = postStore.getError;
  } else if (!postStore.getCurrentPost) {
    pageError.value = "Post tidak ditemukan.";
  }

  initialDataLoaded.value = true;
}

onMounted(loadPostForEdit);

watch(postId, (newId, oldId) => {
  if (newId !== oldId && !isNaN(newId)) {
    loadPostForEdit();
  }
});

async function handleSubmit(formData: { title?: string; content?: string }) {
  if (!postStore.getCurrentPost) {
    console.error("Post tidak tersedia untuk update.");
    return;
  }

  const updatedPost = await postStore.updatePost(
    postStore.getCurrentPost.id,
    formData
  );

  if (updatedPost) {
    router.push(`/posts/${updatedPost.id}`);
  }
}

// Meta tag dinamis
watch(
  () => postStore.getCurrentPost,
  (currentPost) => {
    if (currentPost) {
      useHead({
        title: `Edit: ${currentPost.title} - Aplikasi Saya`,
        meta: [{ name: 'robots', content: 'noindex, nofollow' }],
      });
    } else if (initialDataLoaded.value && pageError.value) {
      useHead({ title: 'Error Edit Post - Aplikasi Saya' });
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.edit-post-page {
  padding-top: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin-bottom: 0;
}
.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-muted);
}
</style>
