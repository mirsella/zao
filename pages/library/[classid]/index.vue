<script setup lang="ts">
import { YoutubeIframe } from "@vue-youtube/component";
import { CapacitorVideoPlayer } from "capacitor-video-player";
import type { Class, Video } from "~/utils/databases";
const { storage, functions } = useAppwrite();

const route = useRoute();
const user = await useAccount();
const cl = ref<Class>();
const premium = computed(() => user.value?.labels.includes("premium"));

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
  useHeadSafe({ title: cl.value?.title });
});

const comments = computed(() => {
  const comments = cl.value?.comments;
  if (!comments) return [];
  console.log("before", comments);
  const c = comments
    .filter((c) => c.verified || c.author_id === user.value?.$id)
    .sort((a, b) => {
      // put self comments first, then sort by date
      if (a.user.$id !== b.user.$id) {
        if (a.user.$id === user.value?.$id) return -1;
        else if (b.user.$id === user.value?.$id) return 1;
      }
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  console.log("after", c);
  return c;
});

const ytplayer = ref();
function ytsetVolume(volume: number) {
  ytplayer.value?.instance.setVolume(volume);
}

const videoplayer = () =>
  document.querySelector(
    "#fullscreenvideoplayer video",
  ) as HTMLMediaElement | null;
async function play(file_id: string, title: string) {
  // pause the yt embed if it's playing
  ytplayer.value?.instance.pauseVideo();
  const url = storage.getFileView("videos", file_id);
  const res = await CapacitorVideoPlayer.initPlayer({
    // https://github.com/jepiqueau/capacitor-video-player/blob/master/docs/API.md#capvideoplayeroptions
    url: url.href,
    playerId: "fullscreenvideoplayer",
    componentTag: "div",
    mode: "fullscreen",
    title,
    chromecast: false,
  });
  if (!res.result) {
    console.error(res.message);
    showError("Impossible de lire la vidéo:" + res.message);
  }
  const player = videoplayer();
  if (!player) {
    showError("Impossible de recupere l'element video");
    return;
  }
  player.volume = 0.4;
  player.setAttribute("controlsList", "nodownload");
}
// the video player doesn't exit when fullscreen is exited, for example by pressing escape
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    // doesn't work, but i'll keep it here
    CapacitorVideoPlayer.exitPlayer();
    // @ts-ignore this is the button (X) next to the <video> that close the player
    videoplayer()?.nextSibling?.click();
  }
});

const newcomment = ref("");
async function postComment() {
  try {
    const res = await functions.createExecution(
      "users",
      JSON.stringify({ classid: cl.value?.$id, content: newcomment.value }),
      false,
      "/comment",
      "POST",
      { "Content-Type": "application/json" },
    );
    if (res.responseStatusCode !== 200) {
      throw new Error(res.responseBody);
    }
  } catch (e) {
    console.error(e);
    showError("impossible de poster le commentaire: " + e);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6 items-center">
    <div id="fullscreenvideoplayer"></div>
    <div v-if="cl" class="max-w-7xl justify-center prose">
      <p class="font-semibold prose-lg w-full text-center">{{ cl.title }}</p>
      <div class="flex justify-center flex-wrap md:flex-nowrap gap-6">
        <youtube-iframe
          ref="ytplayer"
          :video-id="parseYoutubeId(cl.trailer)"
          class="h-auto aspect-video max-w-sm md:max-w-xl"
          :cookie="false"
          @ready="ytsetVolume(40)"
        />
        <p class="m-0">{{ cl.description }}</p>
      </div>
      <p class="divider w-full">Épisodes:</p>
      <VideoPreview
        v-for="video of cl.videos"
        :data="video"
        class="mx-auto m-4 max-w-none hover:shadow-md hover:shadow-accent hover:scale-[1.02] transition"
        @play="play"
      />
      <div>
        <p class="divider w-full">Commentaires:</p>
        <div class="max-w-6xl grid" v-if="premium">
          <textarea
            class="textarea !w-full bg-base-300"
            placeholder="Commentaire..."
            v-model="newcomment"
          ></textarea>
          <button class="m-4 justify-self-end btn px-8 btn-accent">
            Poster
          </button>
        </div>
        <Comment
          :data="comment"
          v-for="comment of comments"
          class="bg-base-200 my-2 p-2 rounded-md"
        />
      </div>
    </div>
    <span
      v-else
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
