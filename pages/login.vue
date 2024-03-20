<script setup lang="ts">
import VOtpInput from "vue3-otp-input";
import { ID } from "appwrite";

(async () => {
  try {
    await useAppwrite().account.get();
    return navigateTo("/settings");
  } catch (e) {}
})();

const { account } = useAppwrite();
let userId = null;
const error = ref("");
const email = ref("");
const showOTP = ref(false);

async function submitEmail() {
  try {
    // TODO: when appwrite cloud 1.5 is released
    // const sessionToken = await account.createEmailToken(ID.unique(), email.value);
    // userId = sessionToken.userId;
  } catch (e) {
    console.log(e);
    error.value = e;
  }
  showOTP.value = true;
}

async function submitOTP(value: string) {
  try {
    // TODO: when appwrite cloud 1.5 is released
    // const session = await account.createSession(userId, value);
  } catch (e) {
    console.log(e);
    error.value = e;
  }
  const redirectPath = useRoute().redirectedFrom.path;
  router.push(redirectPath);
}
</script>

<template>
  <div class="w-full items-center flex flex-col mt-4">
    <h1 class="text-red-500 m-10" v-if="error">
      {{ error }}. Essayer de recharger la page
    </h1>
    <form
      class="card card-body w-full max-w-sm md:max-w-lg shadow-md bg-base-300"
      @submit.prevent="submitEmail"
    >
      <label class="flex input input-bordered items-center gap-2">
        <span class="i-carbon-email size-6" />
        <input
          type="email"
          v-model="email"
          placeholder="email"
          class="grow"
          required
        />
      </label>
      <button
        class="btn mt-2 btn-primary tooltip tooltip-bottom"
        data-tip="Vous allez recevoir un code de verification par mail pour se connecter"
      >
        Envoyer le mail de vérification
      </button>
    </form>
    <div
      v-show="showOTP"
      class="card card-body w-full max-w-sm md:max-w-lg mt-5 shadow-md bg-base-300"
    >
      <div class="flex flex-col items-center">
        <h1 class="mb-2">entrez le code reçu par mail:</h1>
        <VOtpInput
          value=""
          :should-auto-focus="true"
          :should-focus-order="true"
          :num-inputs="6"
          input-classes="w-8 h-10 m-1 rounded-lg text-center !font-xl"
          @on-complete="submitOTP"
          separator=""
        />
      </div>
      <h1 class="italic font-thin text-center">
        regardez dans vos spam si besoin. code valide 5 minutes.
      </h1>
    </div>
  </div>
</template>
