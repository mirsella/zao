// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-appwrite", "@nuxtjs/seo"],
  devtools: { enabled: true },
  // for mobile we can't use ssr (capacitor)
  ssr: false,
  // useless without ssr
  ogImage: { enabled: false },
  // useless without ssr
  schemaOrg: {
    enabled: false,
  },
  appwrite: { project: "65ef4ce532070e537d98" },
  // nuxt seo module
  site: {
    url: process.env.SITE_URL || "http://localhost:3000",
    name: "Inspire",
    description: "quality video classes to improve your life",
    defaultLocale: "fr",
  },
  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
  },
});
