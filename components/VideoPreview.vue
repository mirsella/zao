<script setup lang="ts">
defineProps<{ data: Video }>();
const account = await useAccount();
const premium = account.value?.labels.includes("premium");
</script>

<template>
  <div class="card bg-base-300 card-compact prose">
    <div class="card-body">
      <h4 class="card-title m-0">{{ data.title }}</h4>
      {{ data.description }}
      <div class="card-actions justify-end">
        <div v-if="useMobile()">
          <button class="btn btn-accent" v-if="premium">
            Télécharger
            <span class="i-carbon-download size-6"></span>
            <!-- TODO: add to downloads -->
          </button>

          <div
            class="tooltip tooltip-left tooltip-error"
            v-else
            data-tip="Vous devez être premium pour télécharger cette vidéo"
          >
            <button class="btn btn-disabled">
              Télécharger
              <span class="i-carbon-download size-6"></span>
            </button>
          </div>
        </div>

        <button
          class="btn btn-accent"
          @click="$emit('play', data.file_id, data.title)"
          v-if="premium"
        >
          Regarder
          <span class="i-carbon-play size-6"></span>
        </button>

        <div
          class="tooltip tooltip-left tooltip-error"
          v-else
          data-tip="Vous devez être premium pour regarder cette vidéo"
        >
          <button class="btn btn-disabled">
            Regarder
            <span class="i-carbon-play size-6"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
