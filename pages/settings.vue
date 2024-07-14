<script setup lang="ts">
import Downloads from "~/components/Downloads.vue";

const { account, functions } = useAppwrite();
definePageMeta({ middleware: "auth" });
useHeadSafe({ title: "Compte / Paramètres" });
const { storeid, variantid } = useRuntimeConfig().public;

// NOTE: this is ok to await in the setup function because the middleware already wait for it
const user = await useAccount();
const premium = await isPremium();

onMounted(() => {
  window.addEventListener("focus", async () => {
    user.value = await account.get();
  });
});

const name = ref("");
const nameUsed = ref(false);
async function updateName() {
  nameUsed.value = false;
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
      name.value = `${name.value} est déjà utilisé`;
      setTimeout(() => {
        name.value = "";
        nameUsed.value = false;
      }, 2000);
    } else if (res.responseStatusCode !== 200) {
      throw new Error(res.responseBody);
    } else {
      user.value!.name = name.value;
      name.value = "";
    }
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
    <div class="flex flex-col gap-2 lg:gap-6 w-full items-center">
      <div
        class="tooltip rounded-xl flex place-items-center gap-2 w-full justify-between max-w-xl p-4"
        data-tip="uniquement utilisé pour les commentaires"
      >
        <!-- <p class="text-error" v-show="nameUsed">déjà en utilisation</p> -->
        <p class="mx-1">Pseudonyme</p>
        <label class="input-accent input w-2/3 flex items-center gap-2">
          <input
            class="grow min-w-10"
            :placeholder="user?.name"
            v-model="name"
            :class="{ 'text-error': nameUsed }"
          />
          <button
            class="btn bg-base-300 !border-none !translate-x-[17px] scale-[0.95] hover:scale-100 active:scale-110"
          >
            <span class="i-carbon-save size-6"> </span>
          </button>
        </label>
      </div>
      <div
        class="rounded-xl flex place-items-center gap-2 w-full justify-between max-w-xl p-4"
      >
        <p class="mx-1">Email</p>
        <p class="w-2/3 truncate px-4">{{ user?.email }}</p>
      </div>
      <div
        class="rounded-xl flex place-items-center gap-2 w-full justify-between max-w-xl p-4"
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
      <div class="rounded-xl flex justify-center w-full max-w-xl p-4">
        <button
          class="w-2/3 btn gap-2 border-error hover:scale-[1.05]"
          @click="logout()"
        >
          <span>Se déconnecter</span>
          <span class="i-carbon-logout size-6"></span>
        </button>
      </div>
    </div>
    <div v-if="isMobile()">
      <div class="divider my-6">Téléchargements</div>
      <Downloads />
    </div>
  </div>
</template>
