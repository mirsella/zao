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
  <Header />
  <div v-if="network" class="flex flex-col h-screen">
    <NuxtPage class="mb-auto" />
    <Footer class="mt-10" v-if="!useMobile()" />
  </div>
  <div v-else class="">
    <p class="text-center text-xl prose m-6">
      Vous êtes hors ligne. vous pouvez seulement voir les vidéos préalablement
      télécharger.
    </p>
    <Downloads />
  </div>
</template>
