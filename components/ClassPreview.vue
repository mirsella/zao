<script setup lang="ts">
import type { Class } from "~/types/class";
import { YoutubeIframe } from "@vue-youtube/component";
const props = defineProps<{ data: Class }>();
</script>

<template>
  <button
    class="h-auto btn bg-base-300 shadow-md hover:shadow-none shadow-secondary p-4 max-w-6xl hover:scale-[1.01]"
  >
    <p class="font-bold text-md md:text-lg">
      {{ data.title }}
      <p class="px-2 font-light inline-block">
      ({{ data.videos.length }} videos)
    </p>
    </p>
    <div class="flex max-h-60 md:!max-h-96 justify-items-center items-center justify-around">
      <youtube-iframe
        video-id="dQw4w9WgXcQ"
        class="w-1/2 h-auto max-w-sm"
        :cookie="false"
      />
      <p
        class="w-fit m-2 text-balance font-medium h-fill line-clamp-[8] leading-snug"
      >
        {{ data.description }}
      </p>
    </div>
  </button>
</template>
