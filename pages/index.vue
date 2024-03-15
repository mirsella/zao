<script setup lang="ts">
const account = useAccount();
// todo: add middleware if mobile go to browse directly
</script>
<template>
  <div>
    <h1>homepage</h1>
    {{ account }}
  </div>
</template>
