<script setup lang="ts">
definePageMeta({ middleware: "auth" });
useHeadSafe({ title: "Compte / Paramètres" });

const account = await useAccount();
</script>
<template>
  <div>
    <h1>Account</h1>
    {{ account }}
  </div>
</template>
