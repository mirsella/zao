<script setup lang="ts">
import { CapacitorVideoPlayer } from "capacitor-video-player";
const { storage } = useAppwrite();
const props = defineProps<{ data: Video }>();

function play() {
  const url = storage.getFileView("videos", props.data.file_id);
  console.log(props.data.title, url);
  CapacitorVideoPlayer.initPlayer({
    // https://github.com/jepiqueau/capacitor-video-player/blob/master/docs/API.md#capvideoplayeroptions
    url: url.toString(),
    playerId: "fullscreenvideoplayer",
  });
}
</script>

<template>
  <div class="card bg-base-300 card-compact prose">
    <div class="card-body">
      <h4 class="card-title m-0">{{ data.title }}</h4>
      {{ data.description }}
      <div class="card-actions justify-end">
        <button class="btn btn-accent" v-if="useMobile()">
          Télécharger
          <span class="i-carbon-download size-6"></span>
          <!-- TODO: add to downloads -->
        </button>
        <button class="btn btn-accent" @click="play()">
          Regarder
          <span class="i-carbon-play size-6"></span>
        </button>
      </div>
    </div>
  </div>
</template>
