<script setup lang="ts">
// preload account and classes
onMounted(() => {
  useAccount();
  useClasses();
});

// FIXME: manual logging for development
// const account = await useAccount();
// let res = await useAppwrite().account.createEmailSession(
//   "test@gmail.com",
//   "testtest",
// );
// console.log(res);
</script>

<template>
  <div data-theme="forest" class="flex flex-col h-screen">
    <Header />
    <NuxtPage class="mb-auto" :keepalive="true" />
    <Footer class="mt-10" v-if="!useMobile()" />
  </div>
</template>
