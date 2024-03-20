export default defineNuxtRouteMiddleware(async () => {
  const account = await useAccount();
  if (!account) {
    return navigateTo("/login");
  }
});
