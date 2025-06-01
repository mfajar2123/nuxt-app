import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true, // Menggunakan API global seperti describe, it, expect (mirip Jest)
    environment: 'nuxt', 
  },
});