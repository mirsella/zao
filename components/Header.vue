<template>
  <div class="navbar">
    <div class="navbar-start">
      <button
        class="btn btn-circle btn-ghost hover:scale-105"
        v-if="$route.name != 'index'"
        @click="$router.back()"
      >
        <span class="i-carbon-arrow-left size-6"></span>
      </button>
    </div>
    <div class="navbar-center">
      <a class="font-bold text-center text-xl">Inspire 🍿</a>
    </div>
    <div class="navbar-end">
      <NuxtLink
        v-if="$route.name != 'index'"
        to="/library"
        class="mx-1 btn btn-primary tooltip tooltip-bottom hover:scale-105"
        activeClass="shadow-md shadow-primary"
        data-tip="Bibliothèque"
      >
        <span class="my-2 i-carbon-media-library size-8"></span>
      </NuxtLink>
      <NuxtLink
        to="/settings"
        class="mx-1 btn btn-primary tooltip tooltip-left hover:scale-105"
        activeClass="shadow-md shadow-primary"
        data-tip="Compte / Paramètres"
      >
        <span class="my-2 i-carbon-user-settings size-8"></span>
      </NuxtLink>
    </div>
  </div>
</template>
