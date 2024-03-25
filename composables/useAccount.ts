import type { Models } from "nuxt-appwrite";

let call: any = null;
export const useAccount = async () => {
  const appwrite = useAppwrite();
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  if (!call) {
    call = appwrite.account.get();
  }
  try {
    if (!account.value) {
      account.value = await call;
    }
  } catch {
    account.value = null;
  }
  return account;
};
