export const isWindows = (): boolean => {
  return (window as any).electron.platform() === "win32";
};
