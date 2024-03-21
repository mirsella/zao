<script setup lang="ts">
const search = ref("");
const error = ref("");
const classes = ref<any[]>([]);
const tags = ref<string[]>([]);
const selectedtags = ref<string[]>([]);

(async () => {
  try {
    const { database } = useAppwrite();
    classes.value = (
      await database.listDocuments("classes", "class")
    ).documents;
    tags.value = [...new Set(classes.value.flatMap((c) => c.tags))];
    // tags.value = [...tags.value, ...tags.value, ...tags.value];
  } catch (e: any) {
    console.error(e);
    error.value = e.message;
  }
})();

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
  <div class="flex flex-col w-full gap-4 p-4 items-center">
    <h1 class="text-error m-10" v-if="error">
      {{ error }}.<br />
      Essayer de recharger la page
    </h1>
    <label class="input input-secondary flex items-center w-full max-w-lg">
      <input v-model="search" class="grow" placeholder="Recherche..." />
      <button
        class="i-carbon-close size-6"
        v-show="search.length !== 0"
        @click="search = ''"
      ></button>
    </label>
    <template v-if="classes.length">
      <div class="w-full">
        <h1 class="inline-block mx-2">Tags:</h1>
        <button
          v-for="(tag, index) in tags"
          :class="[
            selectedtags.includes(tag)
              ? '!bg-secondary text-secondary-content'
              : '!bg-base-300 text-base-content',
          ]"
          class="btn btn-sm ml-px hover:scale-105 transition hover:brightness-90"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </template>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
