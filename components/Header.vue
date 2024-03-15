<script setup lang="ts">
const account = await useAccount();
</script>
<template>
  {{ route }}
  <div class="navbar">
    <div class="flex-1"><a class="font-bold text-xl">Inspire 🍿</a></div>
    <NuxtLink
      v-if="$router.currentRoute.value.name != 'index'"
      to="/library"
      class="mx-1 btn btn-primary tooltip tooltip-bottom"
      data-tip="Bibliothèque"
    >
      <span class="my-2 i-carbon-media-library size-8"></span>
    </NuxtLink>
    <NuxtLink
      to="/settings"
      class="mx-1 btn btn-primary tooltip tooltip-left"
      data-tip="Compte / Paramètres"
    >
      <span class="my-2 i-carbon-user-settings size-8"></span>
    </NuxtLink>
  </div>
  <!-- WARN: remove -->
  {{ account || "no account" }}
</template>
