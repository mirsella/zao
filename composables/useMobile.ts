import { Capacitor } from "@capacitor/core";
export const useAccount = async () => {
  return Capacitor.isNativePlatform();
};
