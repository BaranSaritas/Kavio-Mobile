import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function TabsIndex() {
  const router = useRouter();
  const navState = useRootNavigationState();
  const { isAuthenticated, isHydrated } = useSelector((s: RootState) => s.user);

  useEffect(() => {
    if (!navState?.key) return;
    if (!isHydrated) return;

    if (isAuthenticated) {
      router.replace("/(tabs)/profile");
    } else {
      router.replace("/(auth)/login");
    }
  }, [navState, isHydrated, isAuthenticated]);

  return null;
}
