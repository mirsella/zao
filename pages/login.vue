<script setup lang="ts">
import VOtpInput from "vue3-otp-input";
const { ID } = useAppwrite();

definePageMeta({
  // if user is already logged in, redirect to settings page
  middleware: async () => {
    const account = await useAccount();
    if (account) {
      return navigateTo("/settings");
    }
  },
});

const { account } = useAppwrite();
let userId = null;
const email = ref("");
const showOTP = ref(false);

async function submitEmail() {
  try {
    // TODO: when appwrite cloud 1.5 is released
    // const sessionToken = await account.createEmailToken(ID.unique(), email.value);
    // userId = sessionToken.userId;
  } catch (e: any) {
    console.log(e);
    showError(e);
  }
  showOTP.value = true;
}

async function submitOTP(value: string) {
  try {
    // TODO: when appwrite cloud 1.5 is released
    // const session = await account.createSession(userId, value);
  } catch (e: any) {
    console.log(e);
    showError(e);
  }
  // redirect to the previous page
  const redirectPath = useRoute().redirectedFrom?.path;
  await navigateTo(redirectPath || "/settings");
}
</script>

<template>
  <div class="w-full items-center flex flex-col mt-4">
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
