<script setup lang="ts">
import type { Pod } from "~";

useHeadSafe({ title: "Bibliothèque" });

const pods = ref<Pod[]>([]);
usePodcasts().then(
  (podcasts) =>
    (pods.value = podcasts.value.filter((pod) => pod.type === "capsule")),
);

const podsfiltered = ref<Pod[]>([...pods.value]);
</script>

<template>
  <div class="flex flex-col place-items-center">
    <Search
      class="my-6"
      :pods="pods"
      @filtered="(pods) => (podsfiltered = pods)"
    />
    <div
      v-if="pods.length"
      class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 md:max-w-6xl justify-items-center mx-auto"
    >
      <Poster
        :title="true"
        v-for="pod in podsfiltered"
        :pod="pod"
        class="text-xl w-96 md:w-80 lg:w-72 xl:w-80 px-8"
      />
    </div>
    <div
      v-else
      class="mt-12 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 md:max-w-6xl justify-items-center mx-auto"
    >
      <span
        class="w-96 md:w-80 lg:w-72 xl:w-80 aspect-[1/1.3] px-8 skeleton"
        v-for="_ in 10"
      />
    </div>
  </div>
</template>
