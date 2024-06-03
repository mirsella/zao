<script setup lang="ts">
const network = useState("network");
const isloggedin = ref(false);
onMounted(async () => {
  const account = await useAccount();
  watch(account, () => (isloggedin.value = account.value !== null), {
    immediate: true,
  });
});
</script>
<template>
  <div class="navbar md:p-4">
    <div class="navbar-start gap-4">
      <div class="flex items-center">
        <img
          src="/assets/owl.svg"
          alt="logo"
          class="size-10 dark:invert text opacity-85"
        />
        <a class="font-bold text-center text-xl">Zao</a>
      </div>
      <div>page histoire</div>
      <div>page sante mental</div>
    </div>
    <div class="navbar-end" v-if="network">
      <NuxtLink
        v-if="$route.name != 'index'"
        to="/library"
        class="mx-1 btn btn-primary tooltip tooltip-left hover:scale-105"
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
        <span
          v-if="isloggedin"
          class="my-2 i-carbon-user-settings size-8"
        ></span>
        <span v-else class="my-2 i-carbon-user size-8"></span>
      </NuxtLink>
    </div>
  </div>
</template>
