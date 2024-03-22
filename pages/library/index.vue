<script setup lang="ts">
useHeadSafe({ title: "Bibliothèque" });
const search = ref("");
const classes = ref<Class[]>([]);
const tags = ref<string[]>([]);
const selectedtags = ref<string[]>([]);

useClasses().then((data) => {
  classes.value = data.value;
  tags.value = Array.from(
    new Set(data.value.flatMap((cl) => cl.tags).filter((tag) => tag.length)),
  );
});

const classesfiltered = computed(() =>
  classes.value.filter((cl) => {
    if (
      selectedtags.value.length &&
      !selectedtags.value.some((tag) => cl.tags.includes(tag))
    ) {
      return false;
    }
    if (search.value.length) {
      const searchLower = search.value.toLowerCase();
      if (
        !cl.title.toLowerCase().includes(searchLower) &&
        !cl.description.toLowerCase().includes(searchLower)
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
  <div class="flex flex-col w-full gap-4 p-4 items-center">
    <label class="input input-secondary flex items-center w-full max-w-lg">
      <input v-model.trim="search" class="grow" placeholder="Recherche..." />
      <button
        class="i-carbon-close size-6"
        v-show="search.length !== 0"
        @click="search = ''"
      ></button>
    </label>
    <template v-if="classes.length">
      <div class="w-full flex items-center justify-center px-2 flex-wrap">
        <h1 class="inline-block mx-2 prose">Tags:</h1>
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
          {{ tag }}
        </button>
      </div>
      <ClassPreview
        v-for="cl in classesfiltered"
        :data="cl"
        class="hover:shadow-md hover:shadow-secondary hover:scale-[1.01] btn"
        @click="navigateTo(`/library/${cl.$id}`)"
      />
    </template>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
