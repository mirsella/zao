<script setup lang="ts">
import type { Pod } from "~";

useHeadSafe({ title: "Bibliothèque" });

const pods = ref<Pod[]>([]);
usePodcasts().then(
  (podcasts) =>
    (pods.value = podcasts.value.filter((pod) => pod.type === "daily")),
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
    <ul
      v-if="pods.length"
      class="mt-12 max-md:pr-4 timeline timeline-snap-icon max-md:timeline-compact timeline-vertical md:w-4/5 max-w-6xl"
    >
      <li v-for="pod in podsfiltered" class="group w-full">
        <div class="timeline-middle i-carbon-checkmark-outline size-6" />
        <div class="max-md:!mt-2 timeline-start md:group-even:timeline-end">
          {{ pod.$createdAt }}
        </div>
        <div
          class="timeline-end group-odd:!text-start md:group-even:timeline-start timeline-box md:text-end w-full my-4"
        >
          <div class="text-lg font-black">{{ pod.title }}</div>
          <Poster :pod="pod" class="my-4 w-full" />
        </div>
        <hr class="mt-2" />
      </li>
    </ul>
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
