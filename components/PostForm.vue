<template>
  <form @submit.prevent="submitForm" class="post-form">
    <div v-if="apiError" class="error-message mb-3">
      {{ apiError }}
    </div>

    <div class="form-group">
      <label for="title" class="form-label">Judul Postingan:</label>
      <input
        type="text"
        id="title"
        class="form-control"
        v-model="editableTitle"
        required
        placeholder="Masukkan judul..."
      />
      <small v-if="errors.title" class="text-danger error-feedback">{{ errors.title }}</small>
    </div>

    <div class="form-group">
      <label for="content" class="form-label">Isi Postingan:</label>
      <textarea
        id="content"
        class="form-control"
        v-model="editableContent"
        rows="8"
        required
        placeholder="Tuliskan isi postingan Anda di sini..."
      ></textarea>
      <small v-if="errors.content" class="text-danger error-feedback">{{ errors.content }}</small>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">
        {{ isLoading ? (isEditing ? 'Menyimpan...' : 'Membuat...') : (isEditing ? 'Simpan Perubahan' : 'Publikasikan Post') }}
      </button>
      <NuxtLink v-if="isEditing && initialData?.id" :to="`/posts/${initialData.id}`" class="btn btn-secondary ml-1">
        Batal
      </NuxtLink>
       <NuxtLink v-else to="/posts" class="btn btn-secondary ml-1">
        Batal
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">

interface PostData {
  id?: number;
  title: string;
  content: string;
}

const props = defineProps<{
  initialData?: Partial<PostData>;
  isEditing?: boolean;
  isLoading?: boolean;
  apiError?: string | null;
}>();

const emit = defineEmits(['submit']);

const editableTitle = ref('');
const editableContent = ref('');
const errors = ref<{ title?: string; content?: string }>({});

watch(() => props.initialData, (newData) => {
  editableTitle.value = newData?.title || '';
  editableContent.value = newData?.content || '';
  errors.value = {}; // Reset error saat data berubah
}, { immediate: true, deep: true });


function validateForm(): boolean {
  errors.value = {};
  let isValid = true;
  if (!editableTitle.value.trim() || editableTitle.value.length < 3) {
    errors.value.title = 'Judul minimal 3 karakter.';
    isValid = false;
  }
  if (!editableContent.value.trim() || editableContent.value.length < 10) {
    errors.value.content = 'Konten minimal 10 karakter.';
    isValid = false;
  }
  return isValid;
}

const isFormValid = computed(() => {
    // Validasi sederhana untuk UI, validasi utama di server
    return editableTitle.value.trim().length >= 3 && editableContent.value.trim().length >= 10;
});

const submitForm = () => {
  if (validateForm()) {
    emit('submit', {
      title: editableTitle.value,
      content: editableContent.value,
    });
  }
};
</script>

<style scoped>

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem; /* Jarak antar tombol */
}
.error-feedback {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: var(--danger-color); /* Pastikan variabel ini ada atau ganti dengan warna merah */
}
.ml-1 { margin-left: 0.5rem !important; }
</style>