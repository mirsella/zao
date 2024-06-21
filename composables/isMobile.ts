export const isMobile = () => {
  // NOTE: navigator.userAgentData.mobile should be used when it's more widely supported
  return screen.orientation.type.includes("portrait");
};
