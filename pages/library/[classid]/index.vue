<script setup lang="ts">
import type { Class } from "~/types/classes";

const route = useRoute();
const cl = ref<Class>();

useClasses().then((classes) => {
  cl.value = classes.value.find((cl) => cl.$id === route.params.classid);
  if (!cl.value) {
    showError("cette classe n'existe pas");
  }
});
</script>

<template>
  <div class="flex flex-col w-full gap-4 p-4 items-center">
    <template v-if="cl">on the page for the class {{ cl?.$id }}</template>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
