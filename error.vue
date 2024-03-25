<script setup lang="ts">
defineProps({
  error: Object,
});
</script>

<template>
  <div data-theme="forest" class="flex flex-col h-screen">
    <Header />
    <div class="mb-auto mt-6 grid place-items-center gap-4 m-2">
      <p class="text-3xl font-bold">Une erreur est survenue:</p>
      <p class="text-xl font-bold text-error text-wrap w-full text-center">
        {{ error?.message }}
      </p>
      <div
        class="flex justify-center items-center flex-wrap md:flex-nowrap mt-2 w-full"
      >
        <p>Vous pouvez essayer de recharger la page, ou</p>
        <button
          class="btn btn-primary btn-sm m-2 shadow-md shadow-primary"
          @click="clearError({ redirect: '/library' })"
        >
          retourner a la bibliothèque
        </button>
      </div>
      <p class="m-4 w-full text-center">
        Si l'erreur persiste, contactez nous.
      </p>
    </div>
    <Footer class="mt-10" v-if="!useMobile()" />
  </div>
</template>
