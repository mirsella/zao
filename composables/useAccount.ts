import type { Models } from "nuxt-appwrite";

let call: any = null;
export const useAccount = async () => {
  const appwrite = useAppwrite();
  if (!call) {
    call = appwrite.account.get();
  }
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  try {
    account.value = await call;
  } catch {
    account.value = null;
  }
  return account;
};
