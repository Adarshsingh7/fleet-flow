import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTheme } from "@/context/themeContext";

type DialogActionProps = {
  title: string;
  message?: string;
  primaryButton?: {
    text: string;
    onPress: () => void;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
    destructive?: boolean;
  };
};

const DialogAction = ({
  title,
  message,
  primaryButton,
  secondaryButton,
}: DialogActionProps) => {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();

  const hideDialog = () => setVisible(false);

  const handlePress = (action?: () => void) => {
    hideDialog();
    action?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hideDialog}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialogBox, { backgroundColor: theme.background }]}>
          <Text style={[styles.dialogTitle, { color: theme.text }]}>
            {title}
          </Text>
          {message && (
            <Text style={[styles.dialogMessage, { color: theme.text }]}>
              {message}
            </Text>
          )}
          <View style={styles.actionsContainer}>
            {secondaryButton && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handlePress(secondaryButton.onPress)}
              >
                <Text
                  style={[
                    styles.actionText,
                    {
                      color: secondaryButton.destructive
                        ? "#FF3B30"
                        : theme.gray,
                    },
                  ]}
                >
                  {secondaryButton.text}
                </Text>
              </TouchableOpacity>
            )}
            {primaryButton && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  secondaryButton && styles.actionButtonWithBorder,
                ]}
                onPress={() => handlePress(primaryButton.onPress)}
              >
                <Text style={[styles.actionText, { color: theme.primary }]}>
                  {primaryButton.text}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dialogBox: {
    width: Platform.OS === "ios" ? "70%" : "85%",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: Platform.OS === "ios" ? 17 : 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  dialogMessage: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 50, // Increased height to ensure text visibility
    marginBottom: 5,
  },
  actionButtonWithBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#ccc",
  },
  actionText: {
    fontSize: Platform.OS === "ios" ? 17 : 16,
    fontWeight: "500",
  },
});

export default DialogAction;
