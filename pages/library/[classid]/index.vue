<script setup lang="ts">
import type { Class } from "~/types/classes";
const route = useRoute();
const error = ref("");
const cl = ref<Class>();

(async () => {
  try {
    const { database } = useAppwrite();
    cl.value = (await database.getDocument(
      "classes",
      "class",
      route.params.classid as string,
    )) as Class;
  } catch (e: any) {
    console.error(e);
    error.value = e.message;
  }
})();
</script>

<template>
  <div>
    <h1 class="text-error m-10" v-if="error">
      {{ error }}.<br />
      Essayer de recharger la page, ou le lien est incorrect
    </h1>
    on the page for the class {{ cl?.$id }}
  </div>
</template>
