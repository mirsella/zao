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
          <p class="text-sm font-normal pb-2 capitalize">
            {{ pod.type === "daily" ? "histoire" : "story" }}
          </p>
          <h1 class="text-2xl font-bold">{{ pod.title }}</h1>
          <div class="bg-base-200 p-6 mt-6 rounded-xl space-y-5">
            <h2 class="text-xl font-bold">Vous allez découvrir :</h2>
            <ul>
              <li
                v-for="point in pod.key_points"
                class="flex items-center text-cloud text-lg"
              >
                <span class="i-carbon-checkmark size-6 px-6"></span>
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="text-lg font-normal text-center md:text-left">
        <p>
          {{ pod.description }}
        </p>
      </div>
    </div>
  </div>
</template>
