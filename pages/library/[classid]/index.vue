<script setup lang="ts">
import { YoutubeIframe } from "@vue-youtube/component";

const route = useRoute();
const cl = ref<Class>();

useClasses().then((classes) => {
  cl.value = classes.value.find((cl) => cl.$id === route.params.classid);
  if (!cl.value) {
    showError("cette classe n'existe pas");
  }
  useHead({ title: cl.value?.title });
});

const player = ref();
function setVolume(volume: number) {
  player.value?.instance.setVolume(volume);
}
</script>

<template>
  <div class="flex flex-col w-full h-full gap-4 p-4 items-center">
    <div v-if="cl" class="prose">
      <!-- <ClassPreview :data="cl" class="rounded-xl" /> -->
      <p class="font-semibold text-center">{{ cl.title }}</p>
      <div class="flex flex-wrap md:flex-nowrap gap-2">
        <youtube-iframe
          ref="player"
          video-id="dQw4w9WgXcQ"
          class="h-auto aspect-video max-w-sm md:max-w-md"
          :cookie="false"
          @ready="setVolume(40)"
        />
        <p class="mt-0">{{ cl.description }}</p>
      </div>
      <p class="divider">Épisodes:</p>
    </div>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
