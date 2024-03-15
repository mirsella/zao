<script setup lang="ts">
const account = await useAccount();
</script>

<template>
  <div data-theme="forest">
    <Header />
    {{ account }}
    <NuxtPage />
  </div>
</template>
