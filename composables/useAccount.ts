import type { Models } from "nuxt-appwrite";

// TODO: https://chat.openai.com/share/c486c0bb-c429-465a-96dc-46051d12f2ee

export const useAccount = async () => {
  const appwrite = useAppwrite();
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  callOnce(async () => {
    try {
      account.value = await appwrite.account.get();
    } catch {
      account.value = null;
    }
  });
  return account;
};
