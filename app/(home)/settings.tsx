import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLogout } from "@/features/auth/auth.hook";
import { useTheme } from "@/context/themeContext";
import Button from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "../types";

const UserProfileScreen = () => {
  const { theme, toggleTheme, changePrimaryColor, themeMode } = useTheme();
  const { data: authUser } = useQuery<UserType>({ queryKey: ["user"] });
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    router.replace("../../..");
    logout();
  };

  const handleChangeColor = (color: string) => {
    changePrimaryColor(color);
    console.log("CHANGING THE THEME");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
      />

      {/* Modern Header Section */}
      <LinearGradient
        colors={[theme.primary, `${theme.primary}80`]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: authUser?.photo }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.primary }]}
            >
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{authUser?.name}</Text>
          <Text style={styles.userEmail}>{authUser?.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <View style={[styles.section]}>
          <View style={styles.sectionHeader}>
            <Feather name="sun" size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Appearance
            </Text>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.background }]}
          >
            <View style={styles.themeToggleContent}>
              <Feather
                name={themeMode === "dark" ? "moon" : "sun"}
                size={20}
                color={theme.primary}
              />
              <Text style={[styles.themeToggleText, { color: theme.text }]}>
                {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <Switch
              value={themeMode === "dark"}
              onValueChange={toggleTheme}
              thumbColor={theme.primary}
              trackColor={{ false: theme.gray, true: theme.gray }}
              ios_backgroundColor={theme.background}
            />
          </TouchableOpacity>

          {/* Color Picker */}
          <Text style={[styles.colorTitle, { color: theme.text }]}>
            Theme Color
          </Text>
          <View style={styles.colorGrid}>
            {[
              "#512DA8",
              "#36454F",
              "#001F3F",
              "#800020",
              "#228B22",
              "#FFBF00",
              "#008080",
              "#B7410E",
              "#77815C",
              "#483C32",
              "#1877F2",
              "#DC143C",
            ].map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  color === theme.primary && styles.selectedColor,
                ]}
                onPress={() => handleChangeColor(color)}
              >
                {color === theme.primary && (
                  <Feather name="check" size={18} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View style={[styles.section]}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color={theme.text} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Account
            </Text>
          </View>
          <Button onPress={handleLogout} title="Sign out" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 12,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  themeToggleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggleText: {
    fontSize: 15,
    marginLeft: 12,
  },
  colorTitle: {
    fontSize: 15,
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "white",
  },
});

export default UserProfileScreen;
