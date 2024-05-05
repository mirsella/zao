<script setup lang="ts">
import type { SQLiteVideo, Video } from "~";

const props = defineProps<{ data: Video; class_title: string }>();
const { $videoExist } = useNuxtApp();
const account = await useAccount();
const premium = computed(() => account.value?.labels.includes("premium"));
const video_downloaded = ref();

onMounted(async () => {
  video_downloaded.value = await $videoExist(props.data.$id);
});
</script>

<template>
  <div class="card bg-base-200 card-compact prose">
    <div class="card-body">
      <h4 class="card-title m-0">{{ data.title }}</h4>
      {{ data.description }}
      <div class="card-actions justify-end">
        <button
          v-if="useMobile() && !video_downloaded"
          @click="$emit('download', data)"
          :class="{ 'btn-disabled !cursor-not-allowed': !premium }"
          class="btn btn-accent"
        >
          Télécharger
          <span class="i-carbon-download size-6"></span>
        </button>

        <button
          class="btn btn-accent"
          @click="$emit('play', data.file_id, data.title)"
          v-if="premium"
        >
          Regarder
          <span class="i-carbon-play size-6"></span>
        </button>

        <div
          class="tooltip tooltip-left tooltip-error cursor-not-allowed"
          v-else
          data-tip="Vous devez être premium"
        >
          <button class="btn btn-disabled cursor-not-allowed">
            Regarder
            <span class="i-carbon-play size-6"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
