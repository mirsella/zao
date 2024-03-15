import { Capacitor } from "@capacitor/core";

export const useMobile = () => {
  return Capacitor.isNativePlatform();
};
