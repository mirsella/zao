export const isMobile = () => {
  // NOTE: navigator.userAgentData.mobile should be used when it's more widely supported
  if (import.meta.server) return false;
  return screen.orientation.type.includes("portrait");
};
