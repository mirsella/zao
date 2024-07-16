<script setup lang="ts">
import type { Pod, SQLitePod } from "~";
const { storage } = useAppwrite();

const currentPodcast = useState<null | Pod | SQLitePod>(
  "currentPodcast",
  () => null,
);
const currentSrc = ref<string>();
watchEffect(async () => {
  if (!currentPodcast.value) return "";
  if ((currentPodcast.value as Pod).file_id) {
    const url = storage.getFileView(
      "audio",
      (currentPodcast.value as Pod).file_id,
    );
    const res = await fetch(url, {
      credentials: "include",
    });
    currentSrc.value = URL.createObjectURL(await res.blob());
  } else {
    currentSrc.value = (currentPodcast.value as SQLitePod).data;
  }
});
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackrate = ref(1);
const audio = ref<HTMLAudioElement>();

function togglePlay() {
  if (isPlaying.value) {
    audio.value?.pause();
  } else {
    audio.value?.play();
  }
  isPlaying.value = !audio.value?.paused;
}
function fasterplayback() {
  playbackrate.value += 0.1;
  if (Math.round(playbackrate.value * 10) / 10 > 2) playbackrate.value = 1;
  audio.value!.playbackRate = playbackrate.value;
}
function updateTime() {
  currentTime.value = audio.value!.currentTime;
  duration.value = audio.value!.duration;
  isPlaying.value = !audio.value?.paused;
}
function seek() {
  audio.value!.currentTime = currentTime.value;
}
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
</script>

<template>
  <div
    class="bg-base-200 border-t z-10 flex gap-8 px-4 py-2"
    v-if="currentPodcast"
  >
    <audio ref="audio" :src="currentSrc" @timeupdate="updateTime"></audio>
    <div class="hidden md:flex items-center gap-4 max-w-[30%] navbar-start">
      <Poster
        v-if="(currentPodcast as Pod).poster_id"
        :pod="currentPodcast as Pod"
        :sidetitle="true"
        class="h-full"
      />
    </div>
    <div class="flex flex-col items-center gap-2 w-full md:w-1/2">
      <div class="gap-2 flex justify-center items-end">
        <button
          @click="
            currentTime -= 5;
            seek();
          "
          class="btn btn-primary btn-md min-h-10 i-carbon-rewind-5"
        />
        <button
          @click="togglePlay"
          class="min-h-10 btn btn-primary btn-md"
          :class="[isPlaying ? 'i-carbon-pause' : 'i-carbon-play']"
        />
        <button
          @click="
            currentTime += 5;
            seek();
          "
          class="min-h-10 btn btn-primary btn-md i-carbon-forward-5"
        />
        <button @click="fasterplayback()" class="h-10 text-lg">
          {{ playbackrate.toFixed(1) }}x
        </button>
      </div>
      <input
        class="range range-primary range-xs"
        type="range"
        v-model="currentTime"
        :max="duration"
        @input="seek"
      />
      <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>
  </div>
</template>
