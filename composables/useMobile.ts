import { Capacitor } from "@capacitor/core";

export const useMobile = () => {
  // FIXME: to test mobile only components on dev
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return Capacitor.isNativePlatform();
};
