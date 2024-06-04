import { Capacitor } from "@capacitor/core";

export const isMobile = () => {
  // NOTE: navigator.userAgentData.mobile should be used when it's more widely supported
  return (
    Capacitor.isNativePlatform() || screen.orientation.type.includes("portrait")
  );
};
