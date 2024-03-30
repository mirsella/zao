<script setup lang="ts">
import Downloads from "~/components/Downloads.vue";

const { account, functions } = useAppwrite();
definePageMeta({ middleware: "auth" });
useHeadSafe({ title: "Compte / Paramètres" });

// this can't be null because of the middleware
const user = await useAccount();
const premium = computed(() => user.value?.labels.includes("premium"));

const name = ref("");
const nameUsed = ref(false);
watch(name, () => (nameUsed.value = false));
async function updateName() {
  try {
    const res = await functions.createExecution(
      "users",
      "",
      false,
      `/name?name=${name.value}`,
      "PUT",
      { "Content-Type": "application/json" },
    );
    if (res.responseStatusCode === 409) {
      nameUsed.value = true;
    } else if (res.responseStatusCode !== 200) {
      throw new Error(res.responseBody);
    }
    if (user.value) user.value.name = name.value;
    name.value = "";
  } catch (error) {
    console.error(error);
    showError("Impossible de changer le pseudonyme: " + error);
  }
}

async function redirectCustomerPortal() {
  const res = await functions.createExecution(
    "users",
    "",
    false,
    "/customer_portal",
    "GET",
  );
  console.log(res);
  if (res.responseStatusCode !== 200) {
    showError(
      "Impossible de rediriger vers le portail de payement: " +
        res.responseBody,
    );
  }
  await navigateTo(res.responseBody, {
    external: true,
    open: {
      target: "_blank",
    },
  });
}
async function logout() {
  await account.deleteSession("current");
  user.value = null;
  await navigateTo("/");
}
</script>
<template>
  <div>
    <div class="flex gap-4 p-4 w-full flex-wrap grid-cols-2 justify-center">
      <div
        class="tooltip bg-base-300 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-md p-4"
        data-tip="uniquement utilise pour les commentaires"
      >
        <p class="mx-1">Pseudonyme</p>
        <p class="text-error" v-show="nameUsed">déjà en utilisation</p>
        <label class="input-accent input w-2/3 flex items-center">
          <input class="grow" :placeholder="user?.name" v-model="name" />
          <button
            class="i-carbon-save size-4 btn"
            @click="updateName()"
            :disabled="name.length === 0"
          ></button>
        </label>
      </div>
      <div
        class="bg-base-300 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-md p-4"
      >
        <p class="mx-1">Email</p>
        <input
          class="!text-base-content input w-2/3 flex items-center input-disabled"
          :value="user?.email"
        />
      </div>
      <div
        class="bg-base-300 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-md p-4"
      >
        <p class="mx-1">Premium</p>
        <button
          class="flex place-items-center gap-2 w-2/3 text-center btn !border-accent hover:scale-[1.05]"
          @click="redirectCustomerPortal()"
        >
          <span>{{ premium ? "Gérer" : "S'inscrire" }}</span>
          <span
            class="size-6"
            :class="[
              premium ? 'i-carbon-user-admin' : 'i-carbon-airline-manage-gates',
            ]"
          ></span>
        </button>
      </div>
      <div
        class="bg-base-300 rounded-xl flex justify-center w-full max-w-md p-4"
      >
        <button
          class="w-2/3 btn gap-2 !border-error hover:scale-[1.05]"
          @click="logout()"
        >
          <span>Se déconnecter</span>
          <span class="i-carbon-logout size-6"></span>
        </button>
      </div>
    </div>
    <!-- FIXME: only for dev -->
    <!-- <div v-if="useMobile()"> -->
    <div>
      <Downloads />
    </div>
  </div>
</template>
