<script setup lang="ts">
import type { Pod } from "~";

const route = useRoute();
const pod = ref<Pod>();

usePodcasts().then((pods) => {
  pod.value = pods.value.find((pod) => pod.$id === route.params.classid);
  if (!pod.value) {
    showError("cette classe n'existe pas");
  }
  useHeadSafe({ title: pod.value?.title });
});
</script>

<template>
  <div class="flex flex-col gap-4 p-6 items-center">
    <div v-if="pod" class="max-w-5xl justify-center prose">
      <p class="font-semibold prose-lg w-full text-center">{{ pod.title }}</p>
      <p class="m-0 p-2 md:p-0">{{ pod.description }}</p>
    </div>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
