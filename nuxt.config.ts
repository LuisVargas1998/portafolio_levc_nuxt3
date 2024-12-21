export default defineNuxtConfig({
  ssr: false,
  build: {
    //extractCSS: false,
    transpile: ["vuetify", "vuetables", "googlelogin", "calendar"],
  },
  modules: [
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    //['nuxt-leaflet', {css: []}],
  ],
  // alias: {
  //   'leaflet': 'leaflet/dist/leaflet-src.js',
  //   //'nuxt-leaflet': 'nuxt-leaflet/lib/module.js',
  // },
  css: [
    "@/assets/scss/style.scss",
    "leaflet/dist/leaflet.css",
    "vue3-carousel/dist/carousel.css",
    "leaflet.markercluster/dist/MarkerCluster.css",
    "leaflet.markercluster/dist/MarkerCluster.Default.css",
  ],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    // optimizeDeps: {
    //   // exclude: ['nuxt-leaflet']
    //   needsInterop: ['nuxt-leaflet'],
    //   include: ['nuxt-leaflet']
    // },
  },
  // vue: {
  //   compilerOptions: {
  //     isCustomElement: (tag) => ['nuxt-leaflet'].includes(tag),
  //   },
  // },
  routeRules: {
    "/": { swr: true },
    "/cubetable": { swr: true },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL1,
    databaseUrl2: process.env.DATABASE_URL2,
  },
});
