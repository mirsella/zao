<script setup lang="ts">
const { $getVideos, $deleteVideo } = useNuxtApp();
</script>

<template>
  <div v-for="video of $getVideos()">{{ video }}</div>
</template>
