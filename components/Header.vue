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
  <div class="navbar">
    <div class="navbar-start gap-4 !text-2xl">
      <NuxtLink to="/">
        <Logo class="h-10" />
      </NuxtLink>
      <NuxtLink
        to="/daily"
        class="btn"
        activeClass="shadow-md ring-1 ring-primary"
      >
        HISTOIRES
      </NuxtLink>
      <NuxtLink
        to="/capsules"
        class="btn"
        activeClass="shadow-md ring-1 ring-primary"
      >
        SANTÉ MENTAL
      </NuxtLink>
    </div>
    <div class="navbar-end" v-if="network">
      <NuxtLink
        to="/settings"
        class="btn"
        activeClass="shadow-md ring-1 ring-primary"
      >
        <a v-if="isloggedin" class="my-2 flex items-center gap-2">
          Compte & Paramètres
          <span class="i-carbon-user-settings size-8"></span>
        </a>
        <span v-else class="my-2 flex items-center gap-2">
          Se connecter <span class="i-carbon-user size-8"></span
        ></span>
      </NuxtLink>
    </div>
  </div>
</template>
