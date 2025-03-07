import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import CustomHeader from "@/components/header";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "@/context/themeContext"; // Removed unused import 'useTheme'
import { SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a new QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* SafeAreaView to ensure the layout is within the safe area boundaries of */}
      <SafeAreaView style={{ flex: 1 }}>
        {/* Provide the custom theme to the application */}
        <ThemeProvider>
          {/* Provide the Paper components to the application */}
          <PaperProvider>
            {/* Stack navigator for managing screen navigation */}
            <Stack>
              {/* Define the "index" screen with a custom header */}
              <Stack.Screen
                name="index"
                options={{
                  title: "Home",
                  header: () => <CustomHeader title="Login" />,
                }}
              />
              {/* Define the "(home)" screen without a header */}
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
      </SafeAreaView>
    </QueryClientProvider>
  );
}
