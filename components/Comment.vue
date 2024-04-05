<script setup lang="ts">
import type { Comment } from "#imports";

const props = defineProps<{ data: Comment }>();
</script>
<template>
  <div>{{ data.user.name }}: {{ data.content }}</div>
</template>
