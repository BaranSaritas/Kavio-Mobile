import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { hydrateAuth } from "../redux/slices/UserSlice";
import store from "../redux/store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    store.dispatch(hydrateAuth()).finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <Provider store={store}>
      <Slot /> 
      <Toast />
    </Provider>
  );
}
