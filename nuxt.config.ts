// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  plugins: ['~/plugins/axios', '~/plugins/auth-init.client'],
  modules: [
    '@pinia/nuxt',

  ],
  css: ['~/assets/css/main.css']
})
