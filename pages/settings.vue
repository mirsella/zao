<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
const account = useAccount();
</script>
<template>
  <div>
    <h1>Account</h1>
    {{ account }}
  </div>
</template>
