export default defineNuxtRouteMiddleware(async () => {
  const user = await useAccount();
  if (!user || !user.value) {
    return navigateTo("/login");
  }
});
