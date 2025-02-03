import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import CustomHeader from "@/components/header";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/context/themeContext";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
});

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PaperProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  title: "Home",
                  header: () => <CustomHeader title="Login" />,
                }}
              />
              <Stack.Screen
                name="(home)"
                options={{
                  title: "index",
                  headerShown: false,
                }}
              />
            </Stack>
          </PaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
