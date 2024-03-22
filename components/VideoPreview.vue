<script setup lang="ts">
const props = defineProps<{ data: Video }>();
</script>

<template>
  <div>video {{ data.$id }}</div>
</template>
