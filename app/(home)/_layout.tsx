import { Stack, Tabs } from "expo-router";
import CustomHeader from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/themeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function layout() {
  const { theme } = useTheme();
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <Tabs
      screenOptions={{
        headerTintColor: theme.primary,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.gray,
        tabBarInactiveBackgroundColor: theme.background,
        tabBarActiveBackgroundColor: theme.background,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Main",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          header: ({ navigation }) => (
            <CustomHeader
              rightIcon="map-outline"
              title="Home"
              onLeftPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          header: ({ navigation }) => (
            <CustomHeader
              title="Location"
              onLeftPress={() => navigation.goBack()}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          header: ({ navigation }) => (
            <CustomHeader
              title="Home"
              onLeftPress={() => navigation.goBack()}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    // </SafeAreaView>
  );
}
