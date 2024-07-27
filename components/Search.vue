<script setup lang="ts">
import type { Pod } from "~";

const props = defineProps<{ pods: Pod[] }>();
const emit = defineEmits(["filtered"]);
const tags = computed(() =>
  Array.from(
    new Set(props.pods.flatMap((pod) => pod.tags).filter((tag) => tag.length)),
  ),
);
const selectedtags = ref<string[]>([]);
const search = ref("");

watchEffect(() => {
  const filtered = props.pods.filter((pod) => {
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
        !pod.description.toLowerCase().includes(searchLower) &&
        !pod.key_points.some((point) =>
          point.toLowerCase().includes(searchLower),
        ) &&
        !pod.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      ) {
        return false;
      }
    }
    return true;
  });
  emit("filtered", filtered);
});

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
  <div>
    <label
      class="input input-secondary flex items-center w-full max-w-lg mx-auto"
    >
      <input
        v-model.trim="search"
        class="grow text-lg placeholder:text-base-content"
        placeholder="Recherche..."
      />
      <button
        class="i-carbon-close size-6"
        v-show="search.length !== 0"
        @click="search = ''"
      ></button>
    </label>
    <div class="w-full flex items-center justify-center flex-wrap gap-2 mt-6">
      <h1 class="text-xl inline-block md:m-4">Catégories:</h1>
      <button
        v-for="tag in tags"
        :class="{
          'bg-secondary text-secondary-content hover:bg-secondary':
            selectedtags.includes(tag),
        }"
        class="btn btn-sm mx-px hover:scale-105 transition text-lg"
        @click="toggleTag(tag)"
      >
        {{ tag.toLowerCase() }}
      </button>
    </div>
  </div>
</template>
