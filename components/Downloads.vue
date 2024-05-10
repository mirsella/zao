<script setup lang="ts">
import type { SQLiteVideo } from "~";
const { $getVideos, $deleteVideo } = useNuxtApp();

const videos = ref<SQLiteVideo[]>([]);
onMounted(async () => {
  videos.value = await $getVideos();
});

async function play(video: SQLiteVideo) {
  //TODO:
}
</script>

<template>
  <div
    v-if="!videos.length"
    class="p-4 text-lg md:text-xl text-center w-full text-wrap"
  >
    Aucune vidéo téléchargée hors ligne. Vous pouvez télécharger des vidéos dans
    la bibliothèque.
  </div>
  <div id="fullscreen"></div>
  <div class="flex flex-wrap justify-center">
    <div
      v-for="video of videos"
      class="m-2 p-4 card bg-base-300 card-compact w-full max-w-2xl"
    >
      <div class="card-body">
        <p class="card-title m-0">{{ video.class_title }}</p>
        <p class="card-title !font-normal m-0">{{ video.video_title }}</p>
        <span>{{ video.description }}</span>

        <div class="card-actions justify-end">
          <button class="btn btn-error" @click="$deleteVideo(video.id)">
            Supprimer
            <span class="i-carbon-trash-can size-6"></span>
          </button>
          <button class="btn btn-accent" @click="play(video)">
            Regarder
            <span class="i-carbon-play size-6"></span>
          </button>
        </div>
      </div>
    </div>
    <!-- <video -->
    <!--   class="size-1/2" -->
    <!--   :src="video.data" -->
    <!--   controls="true" -->
    <!--   onclick="this.play();arguments[0].preventDefault();" -->
    <!-- ></video> -->
  </div>
</template>
