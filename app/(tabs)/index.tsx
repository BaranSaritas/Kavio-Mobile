import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function TabsIndex() {
  const router = useRouter();
  const navState = useRootNavigationState();
  const { isAuthenticated, isHydrated } = useSelector((s: RootState) => s.user);

  const ready = useMemo(() => {
    return Boolean(navState?.key && isHydrated);
  }, [navState?.key, isHydrated]);

  useEffect(() => {
    if (!ready) return;

    if (isAuthenticated) {
      router.replace("/(tabs)/profile");
    } else {
      router.replace("/(auth)/login");
    }
  }, [ready, isAuthenticated]);

  return null;
}
