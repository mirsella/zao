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
    <label class="input input-primary flex items-center w-full max-w-lg">
      <input v-model="search" class="grow" placeholder="Recherche" />
      <button class="i-carbon-delete size-6" @click="search = ''"></button>
    </label>
    <span
      v-if="classes.length === 0"
      class="loading loading-infinity text-primary loading-lg mt-10"
    />
    <div>
      <button v-for="tag in tags" class="btn">{{ tag }}</button>
    </div>
  </div>
</template>
