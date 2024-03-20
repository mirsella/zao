<script setup lang="ts">
definePageMeta({
  middleware: async () => {
    if (useMobile()) {
      await navigateTo("/library");
    }
  },
});
</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl p-4 font-bold">
            Du contenu de
            <h1 class="font-extrabold underline">qualité.</h1>
          </h1>
          <NuxtLink
            to="/library"
            class="m-2 btn btn-primary shadow-primary shadow-md"
          >
            Accéder a la bibliothèque
            <span class="i-carbon-arrow-right size-6" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 m-6 gap-6">
      <div class="card bg-base-300 shadow-lg shadow-secondary-content">
        <div class="card-body">
          <p class="card-title">Title 1</p>
          <p class="card-body">bla bla</p>
        </div>
      </div>
      <div class="card bg-base-300 shadow-lg shadow-secondary-content">
        <div class="card-body">
          <p class="card-title">Applications IOS & Android</p>
          <p class="card-body">
            retrouvez toutes vos vidéos n'importe ou avec la lecture en arrière
            plan et téléchargement hors ligne.
          </p>
        </div>
      </div>
      <div class="card bg-base-300 shadow-lg shadow-secondary-content">
        <div class="card-body">
          <p class="card-title">7€ par mois.</p>
          <div class="card-body">
            <p>pour un engagement de 12 mois.</p>
            <p>9€/mois sans engagement.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
