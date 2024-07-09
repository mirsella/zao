<script setup lang="ts">
import type { Pod } from "~";

const route = useRoute();
const pod = ref<Pod>();

usePodcasts().then((pods) => {
  pod.value = pods.value.find((pod) => pod.$id === route.params.id);
  if (!pod.value) {
    showError("ce podcast n'existe pas");
  }
  useHeadSafe({ title: pod.value?.title });
});

function play() {
  const currentPodcast = useState("currentPodcast");
  currentPodcast.value = pod.value;
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="space-y-10" v-if="pod">
      <div class="md:flex md:space-x-20">
        <div class="w-60 md:w-1/3 mx-auto pb-5 md:pb-0">
          <Poster :pod="pod" :title="false" />
        </div>
        <div class="flex-1 text-center md:text-left">
          <hr class="hidden md:block border-primary border-t-2 w-9 pb-1" />
          <p class="text-md font-normal pb-2 capitalize">
            {{ pod.type === "daily" ? "histoire" : "story" }}
          </p>
          <p class="text-2xl font-bold">{{ pod.title }}</p>
          <div class="bg-base-200 p-6 mt-6 rounded-xl space-y-5">
            <p class="text-xl font-bold">Vous allez découvrir :</p>
            <div
              v-for="point in pod.key_points"
              class="flex items-center text-cloud text-lg"
            >
              <span class="i-carbon-checkmark size-6 px-6"></span>
              {{ point }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-lg font-normal text-center md:text-left">
        {{ pod.description }}
      </div>
      <div class="btn w-full md:btn-wide text-lg" @click="play()">
        regarder
        <span class="i-carbon-play size-6"></span>
      </div>
    </div>
  </div>
</template>
