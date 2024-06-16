<script setup lang="ts">
// preload account and classes
useAccount();
usePodcasts();
const network = useState("network", () => true);
onMounted(() => {
  window.addEventListener("offline", () => (network.value = false));
  window.addEventListener("online", () => (network.value = true));
});
</script>

<template>
  <div v-if="isMobile()" class="flex flex-col h-screen">
    <NuxtLink to="/">
      <Logo class="h-20 p-4" />
    </NuxtLink>
    <template v-if="network">
      <NuxtPage class="p-10" />
      <!-- TODO: mobile navbar -->
    </template>
    <template v-else>
      <p class="text-center text-xl prose m-6">
        Vous êtes hors ligne. vous pouvez seulement voir les vidéos
        préalablement télécharger.
      </p>
      <Downloads />
    </template>
  </div>

  <template v-else>
    <div class="min-h-screen">
      <Header class="p-6 pb-10 bg-gradient-to-b from-base-300 from-80% mb-20" />
      <NuxtPage class="p-10" />
    </div>
    <Footer />
  </template>
</template>

<style>
html {
  font-family: Roboto, sans;
}
</style>
