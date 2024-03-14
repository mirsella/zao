// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-appwrite", "@nuxtjs/seo"],
  devtools: { enabled: true },
  ssr: false,
  appwrite: { project: process.env.APPWRITE_PROJECT },
  site: {
    url: process.env.SITE_URL || "http://localhost:3000",
    name: "Inspire",
    description: "quality classes to improve your life",
    defaultLocale: "fr",
  },
});
