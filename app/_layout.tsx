import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import FullScreenLoader from "../components/FullScreenLoader";
import { getThemeByName, loadStoredTheme } from "../redux/slices/ThemeSlice";
import { hydrateAuth } from "../redux/slices/UserSlice";
import store, { AppDispatch, RootState } from "../redux/store";
import themes from "../constants/themes";

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { isHydrated, user } = useSelector((state: RootState) => state.user);
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  // Kullanıcı authenticate olduktan sonra temasını yükle
  useEffect(() => {
    if (isHydrated && user?.card?.setting?.theme) {
      const themeName = user.card.setting.theme;
      console.log('Loading theme from user settings:', themeName);
      dispatch(getThemeByName({ themeName }));
    }
  }, [isHydrated, user?.card?.setting?.theme, dispatch]);

  // Hydrate tamamlanana kadar premium loading
  if (!isHydrated) {
    return <FullScreenLoader />;
  }

  // Tema yüklenmemişse default temayı kullan
  const activeTheme = currentTheme?.backgroundColor ? currentTheme : themes.default;

  return (
    <View style={{ flex: 1, backgroundColor: activeTheme.backgroundColor }}>
      <StatusBar 
        backgroundColor={activeTheme.backgroundColor} 
        barStyle="light-content" 
      />
      <Slot />
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Önce storage'dan temayı yükle (hızlı başlangıç için)
    store.dispatch(loadStoredTheme());
    
    // Sonra auth kontrolü yap
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
