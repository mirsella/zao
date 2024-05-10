<script setup lang="ts">
import Downloads from "~/components/Downloads.vue";

const { account, functions } = useAppwrite();
definePageMeta({ middleware: "auth" });
useHeadSafe({ title: "Compte / Paramètres" });
const { storeid, variantid } = useRuntimeConfig().public;

const user = await useAccount();
const premium = computed(() => user.value?.labels.includes("premium"));

onMounted(() => {
  window.addEventListener("focus", async () => {
    user.value = await account.get();
  });
});

const name = ref("");
const nameUsed = ref(false);
watch(name, () => (nameUsed.value = false));
async function updateName() {
  try {
    const res = await functions.createExecution(
      "users",
      JSON.stringify({ name: name.value }),
      false,
      "/name",
      undefined,
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

const portalLoading = ref(false);
const portalbuttonicon = computed(() => {
  if (portalLoading.value) return "loading loading-spinner";
  else if (premium.value) return "i-carbon-user-admin";
  else return "i-carbon-airline-manage-gates";
});
async function redirectCustomerPortal() {
  portalLoading.value = true;
  try {
    const res = await functions.createExecution(
      "users",
      JSON.stringify({ storeid, variantid }),
      false,
      "/customer_portal",
      undefined,
      { "Content-Type": "application/json" },
    );
    portalLoading.value = false;
    if (res.responseStatusCode !== 200) {
      throw new Error(res.responseBody);
    }
    await navigateTo(res.responseBody, {
      external: true,
      open: {
        target: "_blank",
      },
    });
  } catch (error) {
    console.error(error);
    portalLoading.value = false;
    showError("Impossible de rediriger vers le portail de payement: " + error);
  }
}
async function logout() {
  await account.deleteSession("current");
  user.value = null;
  await navigateTo("/");
}
</script>
<template>
  <div>
    <div
      class="flex gap-2 lg:gap-6 lg:px-20 p-4 w-full flex-wrap justify-center"
    >
      <div
        class="tooltip bg-base-300 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-xl p-4"
        data-tip="uniquement utilise pour les commentaires"
      >
        <p class="mx-1">Pseudonyme</p>
        <p class="text-error" v-show="nameUsed">déjà en utilisation</p>
        <label class="input-accent input w-2/3 flex items-center gap-2">
          <input
            class="grow min-w-10"
            :placeholder="user?.name"
            v-model="name"
          />
          <button
            class="i-carbon-save size-4 btn"
            @click="updateName()"
            :disabled="name.length === 0"
          ></button>
        </label>
      </div>
      <div
        class="bg-base-300 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-xl p-4"
      >
        <p class="mx-1">Email</p>
        <input
          class="!text-base-content input w-2/3 flex items-center input-disabled truncate"
          :value="user?.email"
        />
      </div>
      <div
        class="bg-base-300 rounded-xl flex place-items-center gap-2 w-full justify-between max-w-xl p-4"
      >
        <p class="mx-1">Premium</p>
        <button
          class="flex place-items-center gap-2 w-2/3 text-center btn !border-accent hover:scale-[1.05]"
          @click="redirectCustomerPortal()"
        >
          <span>{{ premium ? "Gérer" : "S'inscrire" }}</span>
          <span class="size-6" :class="portalbuttonicon"></span>
        </button>
      </div>
      <div
        class="bg-base-300 rounded-xl flex justify-center w-full max-w-xl p-4"
      >
        <button
          class="w-2/3 btn gap-2 border-error hover:scale-[1.05]"
          @click="logout()"
        >
          <span>Se déconnecter</span>
          <span class="i-carbon-logout size-6"></span>
        </button>
      </div>
    </div>
    <div v-if="useMobile()">
      <div class="divider my-6">Téléchargements</div>
      <Downloads />
    </div>
  </div>
</template>
