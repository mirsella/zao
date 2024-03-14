<script setup lang="ts">
const appwrite = useAppwrite();
// let a = await account.create(
//   ID.unique(),
//   "test@gmail.com",
//   "65ef4ce532070e537d98",
//   "test user",
// );
// await account.createEmailSession("test@gmail.com", "65ef4ce532070e537d98");
// let a = await account.get();
// console.log(a);
const account = useState("account", () => {});
try {
  console.log("account.get");
  account.value = await appwrite.account.get();
} catch (e) {
  console.error("account.get", e);
  await navigateTo("/login");
}
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
