import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For iOS-style icons
import { useTheme } from "@/context/themeContext";

interface CustomHeaderProps {
  title?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title = "Header",
  onLeftPress,
  onRightPress,
  leftIcon = "chevron-back",
  rightIcon = "ellipsis-horizontal",
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Left Button */}
      <TouchableOpacity onPress={onLeftPress} style={styles.leftButton}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={24} color={theme.primary} />
        )}
      </TouchableOpacity>
      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {/* Right Button */}
      <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
        <Ionicons name={rightIcon} size={24} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  leftButton: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    flex: 2,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  rightButton: {
    flex: 1,
    alignItems: "flex-end",
  },
});

export default CustomHeader;
