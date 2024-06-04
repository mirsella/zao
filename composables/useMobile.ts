import { Capacitor } from "@capacitor/core";

export const useMobile = () => {
  // screen.orientation is usually defined on mobile devices but not on desktop
  return (
    Capacitor.isNativePlatform() || typeof screen.orientation !== "undefined"
  );
};
