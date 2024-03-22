<script setup lang="ts">
const props = defineProps<{ data: Video }>();
</script>

<template>
  <div class="card bg-base-300 card-compact prose">
    <div class="card-body">
      <h4 class="card-title m-0">{{ data.title }}</h4>
      {{ data.description }}
      <div class="card-actions justify-end">
        <button class="btn btn-accent" v-if="useMobile()">
          Télécharger
          <span class="i-carbon-download size-6"></span>
          <!-- TODO: add to downloads -->
        </button>
        <button class="btn btn-accent">
          Regarder
          <span class="i-carbon-play size-6"></span>
          <!-- TODO: Add a video player -->
        </button>
      </div>
    </div>
  </div>
</template>
