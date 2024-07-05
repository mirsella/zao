<script setup lang="ts">
// preload account and classes
useAccount();
usePodcasts();
const network = useState("network", () => true);
window.addEventListener("offline", () => (network.value = false));
window.addEventListener("online", () => (network.value = true));
</script>

<template>
  <div v-if="isMobile()" class="flex flex-col h-screen">
    <NuxtLink to="/">
      <Logo class="h-20 p-4" />
    </NuxtLink>
    <template v-if="network">
      <NuxtPage class="p-4" />
      <!-- TODO: mobile navbar -->
    </template>
    <template v-else-if="isNative()">
      <p class="text-center text-xl prose m-6">
        Vous êtes hors ligne. vous pouvez seulement voir les vidéos
        préalablement télécharger.
      </p>
      <Downloads />
    </template>
  </div>

  <template v-else>
    <div class="min-h-screen">
      <Header class="p-6 bg-gradient-to-b from-base-300 from-80% pb-12 mb-4" />
      <NuxtPage class="px-4" />
    </div>
    <Footer class="mt-48" />
  </template>
</template>

<style>
html {
  font-family: Manrope, sans;
}
</style>
