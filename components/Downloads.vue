<script setup lang="ts">
import type { SQLitePod } from "~";
const { $getPodcasts, $deletePodcast } = useNuxtApp();

const pods = ref<SQLitePod[]>([]);
const loading = ref(false);
async function updatePodcasts() {
  loading.value = true;
  pods.value = await $getPodcasts();
  loading.value = false;
}
onMounted(async () => {
  updatePodcasts();
});

async function deletePodcast(id: string) {
  await $deletePodcast(id);
  updatePodcasts();
}
</script>

<template>
  <div id="fullscreen"></div>
  <div
    v-if="!pods.length && !loading"
    class="p-4 text-lg md:text-xl text-center w-full text-wrap"
  >
    Aucun podcast téléchargée hors ligne.
  </div>
  <div class="flex flex-wrap flex-col place-items-center mx-2">
    <div
      v-if="loading"
      class="loading loading-infinity bg-accent size-12"
    ></div>

    <div
      v-for="pod of pods"
      class="m-2 p-4 hover:shadow-md hover:shadow-accent hover:scale-[1.02] transition max-w-4xl card bg-base-300 card-compact"
    >
      <div class="card-body">
        <p class="card-title m-0">{{ pod.title }}</p>
        <p class="card-title !font-normal m-0">{{ pod.description }}</p>
        <span>{{ pod.description }}</span>

        <!-- <pod -->
        <!--   class="aspect-pod h-auto w-auto" -->
        <!--   :src="pod.data" -->
        <!--   controls="true" -->
        <!--   controlslist="nodownload" -->
        <!--   onclick="this.play();arguments[0].preventDefault();" -->
        <!-- ></pod> -->

        <div class="card-actions justify-end">
          <button class="btn btn-error" @click="deletePodcast(pod.id)">
            Supprimer
            <span class="i-carbon-trash-can size-6"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
