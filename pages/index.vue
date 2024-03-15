<script setup lang="ts">
const account = await useAccount();
definePageMeta({
  middleware: async () => {
    if (useMobile()) {
      await navigateTo("/library");
    }
  },
});
</script>

<template>
  <div class="hero">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl p-4 font-bold">
          Du contenu de
          <h1 class="font-extrabold underline">qualité.</h1>
        </h1>
        <NuxtLink
          to="/library"
          class="m-2 btn btn-primary shadow-primary shadow-md"
        >
          Accéder a la bibliothèque
          <span class="i-carbon-arrow-right size-6" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
