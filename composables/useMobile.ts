import { Capacitor } from "@capacitor/core";

export const useMobile = () => {
  // allow us to test mobiles components
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return Capacitor.isNativePlatform();
};
