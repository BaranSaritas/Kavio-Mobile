import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider, useSelector } from "react-redux";
import FullScreenLoader from "../components/FullScreenLoader";
import { hydrateAuth } from "../redux/slices/UserSlice";
import store, { RootState } from "../redux/store";

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const { isHydrated } = useSelector((state: RootState) => state.user);

  // Hydrate tamamlanana kadar premium loading
  if (!isHydrated) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    store.dispatch(hydrateAuth()).finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <Provider store={store}>
      <LayoutContent />
    </Provider>
  );
}
