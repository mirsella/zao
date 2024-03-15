<script setup lang="ts">
const account = await useAccount();
</script>
<template>
  <div>
    <h1>Login</h1>
    {{ account }}
  </div>
</template>
