<script setup lang="ts">
import type { Models } from "nuxt-appwrite";

definePageMeta({ middleware: "auth" });
useHeadSafe({ title: "Compte / Paramètres" });

// this can't be null because of the middleware
const account = (await useAccount()) as Ref<Models.User<Models.Preferences>>;
if (!account.value?.name) {
  useAppwrite()
    .account.updateName(`anonyme`)
    .then((new_account) => (account.value = new_account));
}

const name = ref("");
async function updateName() {
  try {
    account.value = await useAppwrite().account.updateName(name.value);
  } catch (error) {
    console.error(error);
    showError("Impossible de changer le pseudonyme" + error);
  }
}
</script>
<template>
  <div>
    <div class="flex gap-2 p-4 w-full flex-wrap grid-cols-2 justify-around">
      <div
        class="tooltip bg-base-300 p-2 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-md"
        data-tip="uniquement utilise pour les commentaires"
      >
        <p class="mx-1">pseudonyme:</p>
        <label class="input-accent input w-2/3 flex items-center">
          <input class="grow" :placeholder="account.name" v-model="name" />
          <button class="i-carbon-save size-6" @click="updateName()"></button>
        </label>
      </div>
      <div
        class="bg-base-300 p-2 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-md"
      >
        <p class="mx-1">email:</p>
        <input
          class="!text-base-content input w-2/3 flex items-center input-disabled"
          :value="account.email"
        />
      </div>
    </div>
  </div>
</template>
