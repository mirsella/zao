<script setup lang="ts">
// preload account and classes
useAccount();
useClasses();
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <NuxtPage class="mb-auto" />
    <Footer class="mt-10" v-if="!useMobile()" />
  </div>
</template>
