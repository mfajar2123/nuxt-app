<template>
  <div class="container create-post-page">
    <div class="page-header">
      <h1>Buat Postingan Baru</h1>
      <NuxtLink to="/posts" class="btn btn-secondary">Kembali ke Daftar</NuxtLink>
    </div>
    <div class="card">
      <div class="card-body">
        <PostForm
          :is-loading="postStore.isLoading"
          :api-error="postStore.getError"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from '~/store/postStore';

definePageMeta({
  middleware: ['auth']
});

const postStore = usePostStore();
const router = useRouter();

async function handleSubmit(formData: { title: string; content: string }) {

  const newPost = await postStore.createPost(formData);
  if (newPost) {
    router.push(`/posts/${newPost.id}`);
  }

}

useHead({
  title: 'Buat Post Baru - Aplikasi Saya',
  meta: [
    { name: 'description', content: 'Buat dan publikasikan postingan baru Anda.' }
  ]
})
</script>

<style scoped>
.create-post-page {
  padding-top: 1rem;
  max-width: 800px; 
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
</style>