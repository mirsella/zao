import { Capacitor } from "@capacitor/core";

export const useMobile = () => {
  // FIXME: to test mobile only components on dev
  return true;

  return Capacitor.isNativePlatform();
};
