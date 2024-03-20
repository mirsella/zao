<template>
  <div class="navbar">
    <div class="flex-1"><a class="font-bold text-xl">Inspire 🍿</a></div>
    <NuxtLink
      v-if="$router.currentRoute.value.name != 'index'"
      to="/library"
      class="mx-1 btn btn-primary tooltip tooltip-bottom"
      activeClass="shadow-md shadow-primary"
      data-tip="Bibliothèque"
    >
      <span class="my-2 i-carbon-media-library size-8"></span>
    </NuxtLink>
    <NuxtLink
      to="/settings"
      class="mx-1 btn btn-primary tooltip tooltip-left"
      activeClass="shadow-md shadow-primary"
      data-tip="Compte / Paramètres"
    >
      <span class="my-2 i-carbon-user-settings size-8"></span>
    </NuxtLink>
  </div>
</template>
