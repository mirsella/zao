export default defineNuxtRouteMiddleware(async () => {
  const user = await useAccount();
  if (!user.value) {
    return navigateTo("/login");
  }
});
