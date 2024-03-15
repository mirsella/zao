<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
const account = await useAccount();
definePageMeta({
  middleware: async () => {
    if (Capacitor.isNativePlatform()) {
      await navigateTo("/library");
    }
  },
});
</script>
<template>
  <div>
    <h1>homepage</h1>
    {{ account }}
  </div>
</template>
