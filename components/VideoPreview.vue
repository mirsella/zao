<script setup lang="ts">
import type { Video } from "~";

const { storage } = useAppwrite();
const props = defineProps<{ data: Video; class_title: string }>();
const { $videoExist, $storeVideo } = useNuxtApp();
const account = await useAccount();
const premium = computed(() => account.value?.labels.includes("premium"));
const downloaded = ref(false);
const downloading = ref(false);

defineEmits(["play"]);
onMounted(async () => {
  downloaded.value = await $videoExist(props.data.$id);
});

async function download() {
  downloading.value = true;
  const url = storage.getFileView("videos", props.data.$id);
  await $storeVideo(url.href, props.data, props.class_title || "");
  downloaded.value = false;
}
</script>

<template>
  <div class="card bg-base-200 card-compact prose">
    <div class="card-body">
      <p class="card-title m-0">{{ data.title }}</p>
      <span>{{ data.description }}</span>
      <div class="card-actions justify-end">
        <button
          v-if="useMobile() && !downloaded"
          @click="download"
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
