<script setup lang="ts">
const account = useAccount();
</script>
<template>
  <div class="navbar bg-base-200">
    <div class="flex-1"><a class="btn btn-ghost text-xl">Inspire 🍿</a></div>
    <div v-show="account" class="flex-1">
      <div>BROWSE</div>
      <div>ACCOUNT</div>
    </div>
  </div>
</template>
