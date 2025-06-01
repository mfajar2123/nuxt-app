<template>
  <div class="home-page container">
    <header class="hero-section text-center">
      <h1>Selamat Datang di Aplikasi CRUD</h1>
      <p class="lead">Kelola postingan Anda dengan mudah menggunakan Nuxt 3, Drizzle ORM, dan PostgreSQL.</p>
      <NuxtLink to="/posts" class="btn btn-primary btn-lg mt-3">Lihat Semua Postingan</NuxtLink>
    </header>

    <section class="features-section">
      <h2 class="text-center mb-4">Fitur Utama</h2>
      <div class="features-grid">
        <div class="feature-item card">
          <div class="card-body">
            <h3 class="card-title">🚀 Nuxt 3</h3>
            <p class="card-text">Dibangun dengan framework Vue.js terbaru yang powerful dan intuitif.</p>
          </div>
        </div>
        <div class="feature-item card">
          <div class="card-body">
            <h3 class="card-title">💾 Drizzle ORM</h3>
            <p class="card-text">Interaksi database yang aman dan type-safe dengan PostgreSQL.</p>
          </div>
        </div>
        <div class="feature-item card">
          <div class="card-body">
            <h3 class="card-title">📦 Pinia</h3>
            <p class="card-text">Manajemen state yang terpusat dan mudah dikelola.</p>
          </div>
        </div>
        <div class="feature-item card">
          <div class="card-body">
            <h3 class="card-title">✨ SEO Friendly</h3>
            <p class="card-text">Meta tags dinamis untuk optimasi mesin pencari yang lebih baik.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Beranda - Aplikasi CRUD Nuxt Drizzle',
  meta: [
    { name: 'description', content: 'Aplikasi demo untuk CRUD menggunakan Nuxt 3, Drizzle ORM, dan PostgreSQL. Kelola postingan dengan mudah.' },
    { property: 'og:title', content: 'Beranda - Aplikasi CRUD Nuxt Drizzle' },
    { property: 'og:description', content: 'Jelajahi aplikasi demo CRUD yang dibangun dengan teknologi modern.' },
  ]
})
</script>

<style scoped>
.home-page {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.hero-section {
  padding: 3rem 1.5rem;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  margin-bottom: 3rem;
  box-shadow: var(--box-shadow);
}

.hero-section h1 {
  font-size: 2.8rem; /* Lebih besar sedikit */
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-section p.lead {
  font-size: 1.2rem;
  color: var(--text-color-muted);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-lg { /* Ukuran tombol lebih besar */
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

.features-section {
  padding: 2rem 0;
}

.features-section h2 {
  font-weight: 600;
  margin-bottom: 2.5rem !important; /* !important untuk override jika ada dari global */
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Sedikit lebih lebar */
  gap: 1.5rem;
}

.feature-item.card {
  text-align: left;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.feature-item.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
}

.feature-item .card-title {
  color: var(--primary-color);
  font-weight: 600;
}

.text-center {
    text-align: center !important;
}
.mb-4 {
    margin-bottom: 1.5rem !important;
}
.mt-3 {
    margin-top: 1rem !important;
}
</style>