import type { Models } from "nuxt-appwrite";

export const useAccount = async () => {
  const appwrite = useAppwrite();
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  await callOnce(async () => {
    try {
      account.value = await appwrite.account.get();
    } catch {
      account.value = null;
    }
  });
  return account;
};
