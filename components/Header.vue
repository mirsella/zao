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
    <div class="navbar-start gap-4">
      <Logo />
      <div>page histoire</div>
      <div>page sante mental</div>
    </div>
    <div class="navbar-end" v-if="network">
      <NuxtLink
        to="/settings"
        class="mx-1 btn btn-primary"
        activeClass="shadow-md shadow-primary"
        data-tip="Compte / Paramètres"
      >
        <a v-if="isloggedin" class="my-2 flex items-center gap-2">
          Compte & Paramètres
          <span class="i-carbon-user-settings size-8"></span>
        </a>
        <span v-else class="my-2">
          Se connecter <span class="i-carbon-user size-8"></span
        ></span>
      </NuxtLink>
    </div>
  </div>
</template>
