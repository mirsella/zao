<script setup lang="ts">
definePageMeta({
  middleware: () => {
    if (isMobile() && process.env.NODE_ENV !== "development") {
      return navigateTo("/library");
    }
  },
});
</script>

<template>
  <div class="mx-auto max-w-[80%]">
    <div class="flex flex-wrap md:flex-nowrap gap-6 mx-auto p-2 items-center">
      <div class="md:w-1/3">
        <p class="text-5xl py-6 font-bold">
          Les podcasts qui vont transformer votre vie.
        </p>
        <p class="text-xl py-6">
          contenus de qualité, exclusif, <br />
          où que vous soyez.
        </p>
        <NuxtLink to="/library" class="my-4 btn shadow-md">
          Commencer
          <span class="i-carbon-arrow-right size-6" />
        </NuxtLink>
      </div>
      <Carousel class="bg-red-100 md:w-2/3 h-full" />
    </div>
    <div class="grid grid-cols-1 m-6 gap-10">
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <p class="card-title">Title 1</p>
          <p class="card-body">bla bla</p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <p class="card-title">Applications IOS & Android</p>
          <p class="card-body">
            retrouvez toutes vos vidéos n'importe ou avec la lecture en arrière
            plan et téléchargement hors ligne.
          </p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-xl">
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
