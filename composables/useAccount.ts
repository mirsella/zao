import type { Models } from "nuxt-appwrite";

let call: null | Promise<any> = null;

export const useAccount = async () => {
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  if (!call) {
    call = useAppwrite().account.get();
  }
  try {
    if (!account.value) {
      account.value = await call;
    }
  } catch {
    account.value = null;
  }
  // this weird shenaningan is to make sure the account state is not
  // re assigned every time if it was manually cleared (ex: logout)
  call = new Promise((resolve) => {
    resolve(null);
  });
  return account;
};
