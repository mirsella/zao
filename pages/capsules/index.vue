<script setup lang="ts">
import type { Pod } from "~";

useHeadSafe({ title: "Bibliothèque" });
const search = ref("");
const pods = ref<Pod[]>([]);
const tags = ref<string[]>([]);
const selectedtags = ref<string[]>([]);

usePodcasts().then((data) => {
  pods.value = data.value;
  tags.value = Array.from(
    new Set(data.value.flatMap((pod) => pod.tags).filter((tag) => tag.length)),
  );
});

// TODO: better search with more
const podsfiltered = computed(() =>
  pods.value.filter((pod) => {
    if (
      selectedtags.value.length &&
      !selectedtags.value.some((tag) => pod.tags.includes(tag))
    ) {
      return false;
    }
    if (search.value.length) {
      const searchLower = search.value.toLowerCase();
      if (
        !pod.title.toLowerCase().includes(searchLower) &&
        !pod.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  }),
);

function toggleTag(tag: string) {
  const index = selectedtags.value.indexOf(tag);
  if (index !== -1) {
    selectedtags.value.splice(index, 1);
  } else {
    selectedtags.value.push(tag);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center max-w-7xl mx-auto">
    <label class="input input-secondary flex items-center w-full max-w-lg">
      <input v-model.trim="search" class="grow" placeholder="Recherche..." />
      <button
        class="i-carbon-close size-6"
        v-show="search.length !== 0"
        @click="search = ''"
      ></button>
    </label>
    <template v-if="pods.length">
      <div class="w-full flex items-center justify-center flex-wrap gap-2">
        <h1 class="inline-block mx-2 prose">Catégories:</h1>
        <button
          v-for="tag in tags"
          :class="[
            selectedtags.includes(tag)
              ? '!bg-secondary text-secondary-content'
              : '!bg-base-300 text-base-content',
          ]"
          class="btn btn-sm ml-px hover:scale-105 transition hover:brightness-90"
          @click="toggleTag(tag)"
        >
          {{ tag.toLowerCase() }}
        </button>
      </div>
      <div class="mt-10 grid grid-cols-3 gap-16 justify-between w-3/4">
        <Poster
          :title="true"
          v-for="pod in podsfiltered"
          :pod="pod"
          class="size-56 my-8"
        />
      </div>
    </template>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
