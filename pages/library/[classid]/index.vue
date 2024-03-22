<script setup lang="ts">
import { YoutubeIframe } from "@vue-youtube/component";

const route = useRoute();
const cl = ref<Class>();

useClasses().then((classes) => {
  cl.value = classes.value.find((cl) => cl.$id === route.params.classid);
  if (!cl.value) {
    showError("cette classe n'existe pas");
  }
  // sort the videos by episode number, which is represented by the number at the end of the file_id
  cl.value?.videos.sort((a, b) => {
    const getEp = (v: Video) =>
      parseInt(v.file_id.match(/\d+$/)?.[0] as string) || 0;
    let aep = getEp(a);
    let bep = getEp(b);
    return aep - bep;
  });
  useHead({ title: cl.value?.title });
});

const player = ref();
function setVolume(volume: number) {
  player.value?.instance.setVolume(volume);
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 items-center">
    <div v-if="cl" class="max-w-7xl justify-center prose">
      <p class="font-semibold prose-lg w-full text-center">{{ cl.title }}</p>
      <div class="flex flex-wrap md:flex-nowrap gap-6">
        <youtube-iframe
          ref="player"
          :video-id="parseYoutubeId(cl.trailer)"
          class="h-auto aspect-video max-w-sm md:max-w-xl"
          :cookie="false"
          @ready="setVolume(40)"
        />
        <p class="m-0">{{ cl.description }}</p>
      </div>
      <p class="divider w-full">Épisodes:</p>
      <VideoPreview
        v-for="video of cl.videos"
        :data="video"
        class="mx-auto my-4 max-w-none hover:shadow-md hover:shadow-accent hover:scale-[1.02] transition"
      />
      <!-- TODO: comment section -->
    </div>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
