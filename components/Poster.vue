<script setup lang="ts">
import type { Pod } from "~";
const { storage } = useAppwrite();

const props = defineProps<{
  pod: Pod;
  hidetitle?: boolean;
  hideposter?: boolean;
  sidetitle?: boolean;
}>();
const objecturl = ref<string>();

watchEffect(async () => {
  try {
    const url = storage.getFileView("poster", props.pod.poster_id);
    const blob = await (await fetch(url, { credentials: "include" })).blob();
    objecturl.value = URL.createObjectURL(blob);
  } catch (e) {
    console.error(e);
    showError("Error downloading poster: " + e);
  }
});
</script>
<template>
  <NuxtLink
    :to="`/podcast/${props.pod.$id}`"
    class="hover:scale-[1.02] transition flex"
    :class="{ 'flex-col': !sidetitle }"
  >
    <img
      v-if="!hideposter"
      :src="objecturl"
      class="w-auto max-h-full overflow-hidden rounded-lg my-auto"
    />
    <p
      v-if="!hidetitle"
      class="text-lg xl:text-xl px-3 m-auto"
      :class="{ 'pt-4 ': !sidetitle }"
    >
      {{ props.pod.title }}
    </p>
  </NuxtLink>
</template>
