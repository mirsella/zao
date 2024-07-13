<script setup lang="ts">
import type { Pod, SQLitePod } from "~";

const currentPodcast = useState<null | Pod | SQLitePod>(
  "currentPodcast",
  () => null,
);
const currentSrc = computed(() => {
  // TODO: get src from the currentPodcast value
  return "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_500KB_MP3.mp3";
});
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const audio = ref<HTMLAudioElement>();

function togglePlay() {
  if (isPlaying.value) {
    audio.value?.pause();
  } else {
    audio.value?.play();
  }
  isPlaying.value = !isPlaying.value;
}
function updateTime() {
  currentTime.value = audio.value!.currentTime;
  duration.value = audio.value!.duration;
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
  <div class="bg-base-300 z-10 flex gap-8 p-4" v-if="currentPodcast">
    <audio ref="audio" :src="currentSrc" @timeupdate="updateTime"></audio>
    <div
      class="hidden md:flex items-center gap-4 max-w-[30%] overflow-hidden navbar-start"
    >
      <Poster
        v-if="(currentPodcast as Pod).poster_id"
        :pod="currentPodcast as Pod"
        :hidetitle="true"
        class="h-32"
      />
      <p class="text-lg font-bold text-ellipsis max-w-[70%]">
        {{ currentPodcast.title }}
      </p>
    </div>
    <div
      class="flex flex-col items-center justify-center gap-4 w-full md:w-1/2 flex-shrink-0"
    >
      <button @click="togglePlay">{{ isPlaying ? "Pause" : "Play" }}</button>
      <!-- TODO: add volume, forward rewind 10sec  -->
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
