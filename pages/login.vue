<script setup lang="ts">
import VOtpInput from "vue3-otp-input";
const { ID } = useAppwrite();
const { account } = useAppwrite();
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
        await router.replace("/library");
      }
    }
  },
  { immediate: true },
);

let userId;
const loading = ref(false);
const email = ref("");
const showOTP = ref(false);

async function submitEmail() {
  loading.value = true;
  try {
    // TODO: when appwrite cloud 1.5 is released
    // const sessionToken = await account.createEmailToken(ID.unique(), email.value);
    // userId = sessionToken.userId;
  } catch (e: any) {
    loading.value = false;
    console.log(e);
    showError(e);
  }
  loading.value = false;
  showOTP.value = true;
}

async function submitOTP(value: string) {
  loading.value = true;
  try {
    // TODO: when appwrite cloud 1.5 is released
    // const session = await account.createSession(userId, value);
    (await useAccount()).value = await account.get();
  } catch (e: any) {
    loading.value = false;
    console.log(e);
    showError(e);
  }
  loading.value = false;
}

// FIXME: manual logging for development
async function devlogin() {
  loading.value = true;
  let res = await account.createEmailSession(
    email.value + "@gmail.com",
    "testtest",
  );
  console.log(res);
  await account.updateName(
    `anonyme-${Math.floor(Math.random() * 1_000_000_000)}`,
  );
  (await useAccount()).value = await account.get();
  loading.value = false;
}
</script>

<template>
  <div class="w-full items-center flex flex-col mt-4">
    <button class="btn btn-error m-4" @click="devlogin">
      dev login as insertemail@gmail.com
    </button>
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
        regardez dans vos spam si besoin. code valide 15 minutes.
      </h1>
    </div>
    <span
      v-if="loading"
      class="loading loading-infinity text-secondary loading-lg mt-10"
    />
  </div>
</template>
