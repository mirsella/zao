import type { Models } from "nuxt-appwrite";

let call: null | Promise<any> = null;

export const useAccount = async () => {
  const account = useState(
    "account",
    () => null as Models.User<Models.Preferences> | null,
  );
  const network = useState("network");
  if (!call) {
    call = useAppwrite().account.get();
  }
  if (!account.value) {
    try {
      account.value = await call;
      network.value = true;
    } catch (e) {
      if ((e as Error).message.includes("NetworkError")) {
        network.value = false;
      }
      account.value = null;
    }
    // this weird shenaningan is to make sure the account state is not
    // re assigned every time if it was manually cleared (ex: logout)
    call = new Promise((resolve) => {
      resolve(null);
    });
  }
  return account;
};
