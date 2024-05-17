<script setup lang="ts">
import type { SQLiteVideo } from "~";
import { CapacitorVideoPlayer } from "capacitor-video-player";
const { $getVideos, $deleteVideo } = useNuxtApp();

const videos = ref<SQLiteVideo[]>([]);
const loading = ref(false);
async function updateVideos() {
  loading.value = true;
  videos.value = await $getVideos();
  loading.value = false;
}
onMounted(async () => {
  updateVideos();
});

async function deleteVideo(id: string) {
  await $deleteVideo(id);
  updateVideos();
}

// this is not used anymore (using simple video element instead)
// as `blob:http://localhost:3000/a0738e95-08da-44f6-b648-6a07a56f3a70` urls can't be played with capacitor-video-player
// without doing hacky things like https://chatgpt.com/share/32ce162a-42c3-4fe2-9b17-618e18b5bfca (local webserver)
async function play(video: SQLiteVideo) {
  const res = await CapacitorVideoPlayer.initPlayer({
    // url: video.data.replace("blob:", ""),
    url: video.data,
    playerId: "fullscreen",
    componentTag: "div",
    mode: "fullscreen",
    title: video.video_title,
    chromecast: false,
  });
  if (!res.result) {
    console.error(res.message);
    showError("Impossible de lire la vidéo: " + res.message);
  }
  await CapacitorVideoPlayer.setVolume({
    playerId: "fullscreen",
    volume: 0.4,
  });
}

// the video player doesn't exit when fullscreen is exited, for example by pressing escape
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    // empty function wtf ? https://github.com/jepiqueau/capacitor-video-player/issues/155
    CapacitorVideoPlayer.exitPlayer();
    // @ts-ignore this is the button (X) next to the <video> that close the player
    document.querySelector("#fullscreen video")?.nextSibling?.click();
  }
});
</script>

<template>
  <div id="fullscreen"></div>
  <div
    v-if="!videos.length && !loading"
    class="p-4 text-lg md:text-xl text-center w-full text-wrap"
  >
    Aucune vidéo téléchargée hors ligne. Vous pouvez télécharger des vidéos dans
    la bibliothèque.
  </div>
  <div class="flex flex-wrap flex-col place-items-center mx-2">
    <div
      v-if="loading"
      class="loading loading-infinity bg-accent size-12"
    ></div>

    <div
      v-for="video of videos"
      class="m-2 p-4 hover:shadow-md hover:shadow-accent hover:scale-[1.02] transition max-w-4xl card bg-base-300 card-compact"
    >
      <div class="card-body">
        <p class="card-title m-0">{{ video.class_title }}</p>
        <p class="card-title !font-normal m-0">{{ video.video_title }}</p>
        <span>{{ video.description }}</span>

        <video
          class="aspect-video h-auto w-auto"
          :src="video.data"
          controls="true"
          onclick="this.play();arguments[0].preventDefault();"
        ></video>

        <div class="card-actions justify-end">
          <button class="btn btn-error" @click="deleteVideo(video.id)">
            Supprimer
            <span class="i-carbon-trash-can size-6"></span>
          </button>
          <!-- <button class="btn btn-accent" @click="play(video)"> -->
          <!--   Regarder -->
          <!--   <span class="i-carbon-play size-6"></span> -->
          <!-- </button> -->
        </div>
      </div>
    </div>
  </div>
</template>
