<script setup lang="ts">
// preload account and classes
useAccount();
useClasses();
const network = useState("network", () => true);
onMounted(() => {
  window.addEventListener("offline", () => (network.value = false));
  window.addEventListener("online", () => (network.value = true));
});
</script>

<template>
  <div v-if="isMobile()" class="flex flex-col h-screen">
    <div v-if="network">
      <NuxtPage class="mb-auto" />
    </div>
    <div v-else>
      <Logo class="p-4" />
      <p class="text-center text-xl prose m-6">
        Vous êtes hors ligne. vous pouvez seulement voir les vidéos
        préalablement télécharger.
      </p>
      <Downloads />
    </div>
    <NuxtPage class="mb-auto" />
  </div>

  <div v-else>
    <Header />
    <NuxtPage class="mb-auto" />
    <Footer class="mt-10" />
  </div>
</template>
