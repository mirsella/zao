export default defineNuxtRouteMiddleware(async () => {
  const account = await useAccount();
  if (!account.value) {
    return navigateTo("/login");
  }
});
