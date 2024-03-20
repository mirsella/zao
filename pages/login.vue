<script setup lang="ts">
import VOtpInput from "vue3-otp-input";

const account = await useAccount();
const error = ref("");
const email = ref("");
const showOTP = ref(true);
const otp = ref("");
// const redirectPath = useRoute().redirectedFrom.path;
function submitEmail() {
  // account.sendEmailVerification(email.value);
  showOTP.value = true;
}
</script>

<template>
  <div class="w-full items-center flex flex-col mt-4">
    <h1 class="text-red-500 m-10" v-if="error">
      {{ error }}. Essayer de recharger la page
    </h1>
    <form
      class="card card-body w-full max-w-sm md:max-w-lg shadow-2xl bg-base-300"
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
      <input
        type="submit"
        class="btn mt-2 btn-primary tooltip tooltip-bottom"
        data-tip="Vous allez recevoir un code de verification par mail pour se connecter"
        value="Envoyer le mail de vérification"
      />
    </form>
    <div
      v-show="showOTP"
      class="card card-body w-full max-w-sm md:max-w-lg mt-5 shadow-2xl bg-base-300"
    >
      <div class="flex flex-col items-center">
        <h1 class="mb-2">entrez le code reçu par mail:</h1>
        <VOtpInput
          :num-inputs="6"
          input-classes="w-8 h-10 m-1 rounded-lg text-center !font-xl"
          separator=""
        />
      </div>
      <h1 class="italic font-thin text-center">
        regardez dans vos spam si besoin. code valide 5 minutes.
      </h1>
    </div>
  </div>
</template>
