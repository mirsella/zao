export default defineNuxtRouteMiddleware(async () => {
  try {
    await useAppwrite().account.get();
  } catch (error) {
    return navigateTo("/login");
  }
});
