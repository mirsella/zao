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
  <div class="bg-purple-200 h-20 z-10">
    <Poster
      v-if="currentPodcast instanceof Pod"
      :pod="currentPodcast"
      class="w-full"
    />
    <audio ref="audio" :src="currentSrc" @timeupdate="updateTime"></audio>
    <button @click="togglePlay">{{ isPlaying ? "Pause" : "Play" }}</button>
    <input type="range" v-model="currentTime" :max="duration" @input="seek" />
    <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
  </div>
</template>
