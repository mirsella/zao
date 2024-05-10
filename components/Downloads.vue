<script setup lang="ts">
import type { SQLiteVideo } from "~";
const { $getVideos, $deleteVideo } = useNuxtApp();

const videos = ref<SQLiteVideo[]>([]);
onMounted(async () => {
  videos.value = await $getVideos();
});
</script>

<template>
  <div v-if="!videos.length" class="p-4 text-lg text-center w-full text-wrap">
    Aucune vidéo téléchargée hors ligne. Vous pouvez télécharger des vidéos dans
    la bibliothèque.
  </div>
  <div v-for="video of videos" class="m-4 p-4 bg-base-300">
    {{ video }}
    <video
      class="size-1/2"
      :src="video.data"
      controls="true"
      onclick="this.play();arguments[0].preventDefault();"
    ></video>
    <button class="btn btn-error" @click="$deleteVideo(video.id)">
      delete
    </button>
  </div>
</template>
