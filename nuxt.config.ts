// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-appwrite", "@nuxtjs/seo"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
    keepAlive: true,
  },
  devtools: { enabled: true },
  // for mobile we can't use ssr (capacitor)
  ssr: false,
  // useless without ssr
  ogImage: { enabled: false },
  // useless without ssr
  schemaOrg: {
    enabled: false,
  },
  appwrite: {
    project: "65ef4ce532070e537d98",
  },
  runtimeConfig: {
    public: {
      storeid: "75435",
      // premium variant
      variantid: "317198",
    },
  },
  nitro: {
    // gzip doesn't work with capacitor
    compressPublicAssets: { gzip: false, brotli: true },
  },
  // nuxt seo module
  site: {
    url: process.env.SITE_URL || "http://localhost:3000",
    name: "Zao",
    description: "quality podcast to improve your life",
    defaultLocale: "fr",
  },
});
