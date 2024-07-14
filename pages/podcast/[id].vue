<script setup lang="ts">
import type { Pod } from "~";

const premium = await isPremium();
const route = useRoute();
const pod = ref<Pod>();

usePodcasts().then((pods) => {
  pod.value = pods.value.find((pod) => pod.$id === route.params.id);
  if (!pod.value) {
    return showError("ce podcast n'existe pas");
  }
  useHeadSafe({ title: pod.value.title });
});

function play() {
  const currentPodcast = useState("currentPodcast");
  currentPodcast.value = pod.value;
}
</script>

<template>
  <div v-if="pod" class="max-w-5xl mx-auto p-6">
    <div class="md:flex md:space-x-20">
      <div class="w-60 md:w-1/3 m-auto">
        <Poster :pod="pod" :hidetitle="true" class="max-h-[90%]" />
      </div>
      <div class="flex-1 text-center md:text-left">
        <hr class="border-primary max-md:mx-auto mt-4 border-t-2 w-12" />
        <p class="text-md font-normal pb-2 capitalize">
          {{ pod.type === "daily" ? "histoire" : "story" }}
        </p>
        <p class="text-2xl mb-4 font-bold">{{ pod.title }}</p>
        <div class="bg-base-200 my-4 p-6 rounded-xl space-y-5">
          <p class="text-xl font-bold">Vous allez découvrir :</p>
          <div
            v-for="point in pod.key_points"
            class="flex items-center text-cloud text-lg"
          >
            <span class="i-carbon-checkmark size-6 px-6"></span>
            {{ point }}
          </div>
        </div>
        <div
          :class="{ tooltip: !premium }"
          class="my-4"
          data-tip="Réserver aux abonnés premium"
        >
          <div
            class="btn btn-wide text-lg"
            @click="play()"
            :disabled="!premium"
          >
            écouter
            <span class="i-carbon-play size-6"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="text-lg font-normal text-center md:text-left mt-6">
      {{ pod.description }}
    </div>
  </div>
</template>
