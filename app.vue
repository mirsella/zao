<script setup lang="ts"></script>

<template>
  <div data-theme="forest" class="flex flex-col h-screen">
    <Header />
    <NuxtPage class="mb-auto" />
    <Footer v-if="!useMobile()" />
  </div>
</template>
