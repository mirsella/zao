<script setup lang="ts">
import type { Video } from "~";

const { storage } = useAppwrite();
const props = defineProps<{ data: Video; class_title: string }>();
const { $videoExist, $storeVideo } = useNuxtApp();
const account = await useAccount();
const premium = computed(() => account.value?.labels.includes("premium"));

enum Status {
  Downloading,
  Downloaded,
  NotDownloaded,
}

const status = ref<Status>(Status.NotDownloaded);

defineEmits(["play"]);
onMounted(async () => {
  if (await $videoExist(props.data.$id)) {
    status.value = Status.Downloaded;
  }
});

async function download() {
  status.value = Status.Downloading;
  try {
    const url = storage.getFileView("videos", props.data.$id);
    await $storeVideo(url.href, props.data, props.class_title || "");
  } catch (e) {
    showError("impossible de télécharger la video: " + e);
  }
  status.value = Status.Downloaded;
}
</script>

<template>
  <div class="card bg-base-300 card-compact prose">
    <div class="card-body">
      <p class="card-title m-0">{{ data.title }}</p>
      <span>{{ data.description }}</span>
      <div class="card-actions justify-end">
        <button
          v-if="isMobile()"
          @click="download"
          :class="{
            'btn-disabled !cursor-not-allowed':
              !premium || status !== Status.NotDownloaded,
          }"
          class="btn btn-accent"
        >
          Télécharger
          <span
            v-if="status === Status.NotDownloaded"
            class="i-carbon-download size-6"
          ></span>
          <span
            v-else-if="status === Status.Downloading"
            class="loading size-6"
          ></span>
          <span
            v-else-if="status === Status.Downloaded"
            class="i-carbon-checkmark size-6"
          ></span>
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
