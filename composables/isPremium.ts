export const isPremium = async () => {
  const user = await useAccount();
  return computed(() => user.value?.labels.includes("premium"));
};
