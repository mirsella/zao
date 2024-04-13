import type { Models } from "nuxt-appwrite";

let call: any = null;
let first = true;
export const useAccount = async () => {
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  if (!call && first) {
    call = useAppwrite().account.get();
    first = false;
  }
  try {
    if (!account.value && call) {
      account.value = await call;
    }
  } catch {
    account.value = null;
  }
  return account;
};
