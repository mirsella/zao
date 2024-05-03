import { Capacitor } from "@capacitor/core";

export const useMobile = () => {
  // to test mobile only components on dev
  return true;
  return Capacitor.isNativePlatform();
};
