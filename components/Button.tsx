import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/context/themeContext";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  color?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    title = "Button",
    onPress,
    disabled = false,
    loading = false,
    buttonStyle = {},
    textStyle = {},
    icon = null,
    color,
    children,
  } = props;

  const { theme } = useTheme();
  const buttonColor = color || theme.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        { opacity: pressed ? 0.8 : 1, backgroundColor: buttonColor },
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {children ? (
            children
          ) : (
            <Text style={[styles.text, textStyle]}>{title}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // Android shadow
    flexDirection: "row",
    width: "100%", // Full width
  },
  disabledButton: {
    backgroundColor: "#A9A9A9", // Gray for disabled
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF", // White text
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
});

export default Button;
