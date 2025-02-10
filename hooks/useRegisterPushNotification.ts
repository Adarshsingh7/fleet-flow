import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export function useRegisterPushNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    async function registerPushNotificationsAsync() {
      // Configure notification channel for Android devices
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          showBadge: true,
          sound: "default",
          lightColor: "#EF9A9A",
        });
      }

      // Check if the device is a physical device
      if (Device.isDevice) {
        // Get existing notification permissions status
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        // If permissions are not granted, request them
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          setPermissionStatus(status);
        } else {
          // If permissions are already granted, set the status
          setPermissionStatus(existingStatus);
        }
      } else {
        // If not a physical device, set permission status to null
        setPermissionStatus(null);
      }
    }

    // Call the async function to register push notifications
    registerPushNotificationsAsync();
  }, []);

  return { status: permissionStatus };
}
