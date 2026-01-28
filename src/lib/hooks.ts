import { useSyncExternalStore } from "react";

// A hook that safely detects if we're on the client side after hydration
// This avoids the setState-in-useEffect pattern that React 19 lints against
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}
