<script setup lang="ts">
import type { Pod } from "~";
const { storage } = useAppwrite();

const props = defineProps<{ pod: Pod; title?: boolean }>();
const objecturl = ref<string>();

(async () => {
  try {
    const url = storage.getFileView("poster", props.pod.poster_id);
    const blob = await (await fetch(url, { credentials: "include" })).blob();
    objecturl.value = URL.createObjectURL(blob);
  } catch (e) {
    console.error(e);
    showError("Error downloading poster: " + e);
  }
})();
</script>
<template>
  <NuxtLink
    :to="`/podcast/${props.pod.$id}`"
    class="hover:scale-105 transition"
  >
    <img :src="objecturl" class="w-full rounded-lg" />
    <p v-if="title" class="text-md md:text-lg pt-4 px-3">
      {{ props.pod.title }}
    </p>
  </NuxtLink>
</template>
