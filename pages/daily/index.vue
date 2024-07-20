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
          {{
            new Date(pod.$createdAt).toLocaleString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
            })
          }}
        </div>
        <div
          class="timeline-end group-odd:!text-start md:group-even:timeline-start timeline-box md:text-end w-full md:w-2/3 my-4"
        >
          <div class="text-lg font-black">{{ pod.title }}</div>
          <Poster :pod="pod" class="my-4 w-full" :hidetitle="true" />
        </div>
        <hr class="mt-2" />
      </li>
      <li v-if="podsfiltered.length" class="w-full h-0">
        <div
          class="timeline-middle bg-gradient-to-t from-20% max-md:ml-2 from-base-100 w-2 h-[30rem] z-10 -translate-y-[30rem]"
        ></div>
      </li>
    </ul>
    <div
      v-else
      class="mt-12 max-md:pr-4 timeline timeline-snap-icon max-md:timeline-compact timeline-vertical md:w-4/5 max-w-6xl"
    >
      <li v-for="_ in 5" class="group w-full">
        <div class="timeline-middle i-carbon-checkmark-outline size-6" />
        <div
          class="timeline-end group-odd:!text-start md:group-even:timeline-start timeline-box md:text-end my-4"
        >
          <span class="w-64 aspect-[1/1.3] inline-block skeleton my-4" />
        </div>
        <hr class="mt-2" />
      </li>
    </div>
  </div>
</template>
