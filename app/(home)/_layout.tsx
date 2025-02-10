import { Stack, Tabs } from "expo-router";
import CustomHeader from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/themeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function layout() {
  const { theme } = useTheme();
  return (
    // Uncomment the SafeAreaView to wrap the entire layout in a safe area view
    // <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <Tabs
      screenOptions={{
        headerTintColor: theme.primary, // Set the header text color to the primary theme color
        tabBarActiveTintColor: theme.primary, // Set the active tab icon color to the primary theme color
        tabBarInactiveTintColor: theme.gray, // Set the inactive tab icon color to the gray theme color
        tabBarInactiveBackgroundColor: theme.background, // Set the inactive tab background color to the theme background color
        tabBarActiveBackgroundColor: theme.background, // Set the active tab background color to the theme background color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Main", // Title for the main screen
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} /> // Icon for the main tab
          ),
          header: ({ navigation }) => (
            <CustomHeader
              rightIcon="map-outline" // Icon on the right side of the header
              title="Home" // Title in the header
              onLeftPress={() => navigation.goBack()} // Action for the left button press
            />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Location", // Title for the location screen
          header: ({ navigation }) => (
            <CustomHeader
              title="Location" // Title in the header
              onLeftPress={() => navigation.goBack()} // Action for the left button press
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} /> // Icon for the location tab
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings", // Title for the settings screen
          header: ({ navigation }) => (
            <CustomHeader
              title="Home" // Title in the header
              onLeftPress={() => navigation.goBack()} // Action for the left button press
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} /> // Icon for the settings tab
          ),
        }}
      />
    </Tabs>
    // </SafeAreaView>
  );
}
