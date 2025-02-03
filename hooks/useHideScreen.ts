import * as SplashScreen from "expo-splash-screen";

export const hideScreen = () => {
  SplashScreen.preventAutoHideAsync();
};

export const showScreen = () => {
  SplashScreen.hideAsync();
};
