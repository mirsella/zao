<script setup lang="ts">
import { YoutubeIframe } from "@vue-youtube/component";
import { CapacitorVideoPlayer } from "capacitor-video-player";
import type { Class, Video } from "~";
const { storage } = useAppwrite();

const route = useRoute();
const cl = ref<Class>();

usePodcasts().then((classes) => {
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
  useHeadSafe({ title: cl.value?.title });
});

const ytplayer = ref();
function ytsetVolume(volume: number) {
  ytplayer.value?.instance.setVolume(volume);
}

async function play(file_id: string, title: string) {
  // pause the yt embed if it's playing
  ytplayer.value?.instance.pauseVideo();

  const url = storage.getFileView("videos", file_id);
  const res = await CapacitorVideoPlayer.initPlayer({
    // https://github.com/jepiqueau/capacitor-video-player/blob/master/docs/API.md#capvideoplayeroptions
    url: url.href,
    playerId: "fullscreen",
    componentTag: "div",
    mode: "fullscreen",
    title,
    chromecast: false,
  });
  if (!res.result) {
    console.error(res.message);
    showError("Impossible de lire la vidéo: " + res.message);
  }
  document.querySelector("video")?.setAttribute("controlsList", "nodownload");
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
  <div class="flex flex-col gap-4 p-6 items-center">
    <div id="fullscreen"></div>
    <div v-if="cl" class="max-w-5xl justify-center prose">
      <p class="font-semibold prose-lg w-full text-center">{{ cl.title }}</p>
      <div class="flex justify-center flex-wrap md:flex-nowrap gap-6">
        <youtube-iframe
          ref="ytplayer"
          :video-id="parseYoutubeId(cl.trailer)"
          class="aspect-video max-w-sm md:max-w-xl h-auto"
          :cookie="false"
          @ready="ytsetVolume(40)"
        />
        <p class="m-0 p-2 md:p-0">{{ cl.description }}</p>
      </div>
      <p class="divider my-6">Épisodes:</p>
      <VideoPreview
        v-for="video of cl.videos"
        :key="video.$id"
        :data="video"
        :class_title="cl.title"
        class="mx-auto m-4 hover:shadow-md hover:shadow-accent hover:scale-[1.02] transition max-w-4xl"
        @play="play"
      />
      <p class="divider my-6">Commentaires:</p>
      <Comments
        :comments="cl.comments || []"
        :classid="cl.$id"
        class="max-w-4xl"
      />
    </div>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
