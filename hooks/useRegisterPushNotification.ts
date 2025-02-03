import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export function useRegisterPushNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    async function registerPushNotificationsAsync() {
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

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          setPermissionStatus(status);
        } else {
          setPermissionStatus(existingStatus);
        }
      } else {
        setPermissionStatus(null);
      }
    }

    registerPushNotificationsAsync();
  }, []);

  return { status: permissionStatus };
}
