<script setup lang="ts">
import VOtpInput from "vue3-otp-input";
const { ID, account } = useAppwrite();
const router = useRouter();
useHeadSafe({ title: "Connection" });

// automaticlly redirect when the user is logged in
watch(
  await useAccount(),
  async (account) => {
    if (account) {
      // redirect to the previous page
      const redirectPath = useRoute().redirectedFrom?.path;
      if (redirectPath) {
        router.back();
      } else {
        await router.replace("/capsules");
      }
    }
  },
  { immediate: true, deep: true },
);

let userId: string;
const loading = ref(false);
const email = ref("");
const showOTP = ref(false);
const errorOPT = ref(false);

async function submitEmail() {
  loading.value = true;
  try {
    const sessionToken = await account.createEmailToken(
      ID.unique(),
      email.value,
    );
    userId = sessionToken.userId;
  } catch (e: any) {
    loading.value = false;
    console.error("submitEmail", e);
    showError(e);
  }
  loading.value = false;
  showOTP.value = true;
}

async function submitOTP(value: string) {
  loading.value = true;
  try {
    await account.createSession(userId, value);
    (await useAccount()).value = await account.get();
  } catch (e: any) {
    loading.value = false;
    console.error("wrong code", e);
    errorOPT.value = true;

    setTimeout(() => {
      errorOPT.value = false;
    }, 1000);
  }
  loading.value = false;
}

// FIXME: manual logging for development
async function devlogin() {
  if (!email.value.length) {
    return;
  }
  loading.value = true;
  await account.createEmailPasswordSession(
    email.value + "@gmail.com",
    "testtest",
  );
  (await useAccount()).value = await account.get();
  loading.value = false;
}
</script>

<template>
  <div class="items-center flex flex-col max-w-3xl mx-auto">
    <span class="text-center text-3xl font-bold mb-14">
      Connectez vous. nous allons vous envoyer un code de vérification par mail.
    </span>
    <form
      class="w-full gap-6 max-w-sm md:max-w-lg"
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
        class="btn mt-2 btn-primary tooltip tooltip-bottom w-full"
        data-tip="Vous allez recevoir un code de verification par mail pour se connecter"
      >
        Envoyer le mail de vérification
      </button>
    </form>
    <button
      class="btn btn-error m-4 opacity-10 absolute left-0 top-20"
      @click="devlogin"
    >
      <!-- FIXME: remove -->
      dev login
    </button>
    <div
      v-show="showOTP"
      class="w-full max-w-sm md:max-w-lg mt-10 transition-all duration-2000 rounded-lg"
      :class="{ 'shadow-[0px_5px_4px_0px] shadow-error': errorOPT }"
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
          :disabled="loading"
        />
      </div>
      <h1 class="italic font-thin text-center">
        regardez dans vos spam si besoin. code valide 15 minutes.
      </h1>
    </div>
    <span
      v-if="loading"
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
