<script setup lang="ts">
import { YoutubeIframe } from "@vue-youtube/component";
import type { Class } from "~";

defineProps<{ data: Class }>();

const player = ref();
function setVolume(volume: number) {
  player.value?.instance.setVolume(volume);
}
</script>

<template>
  <div
    class="h-auto bg-base-300 p-4 max-w-6xl"
  >
    <p class="font-bold text-md md:text-lg">
      {{ data.title }}
      <p class="px-2 font-light inline-block">
      ({{ data.videos.length }} videos)
    </p>
    </p>
    <div class="flex max-h-60 md:!max-h-96 justify-items-center items-center justify-around">
      <youtube-iframe
        ref="player"
        :video-id="parseYoutubeId(data.trailer)"
        class="w-3/5 h-auto max-w-md"
        :cookie="false"
        @ready="setVolume(50)"
      />
      <p
        class="w-fit m-2 text-balance font-medium h-fill line-clamp-[8] leading-snug"
      >
        {{ data.description }}
      </p>
    </div>
  </div>
</template>
