import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { useRegisterPushNotifications } from "./useRegisterPushNotification";

interface Props {
  onCancelNotification?: () => void;
  title: string;
  body: string;
  category: string;
}

export const useNotification = ({
  onCancelNotification,
  title,
  body,
  category,
}: Props) => {
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const { status } = useRegisterPushNotifications();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  Notifications.setNotificationCategoryAsync(category, [
    {
      identifier: "cancel-action",
      buttonTitle: "Cancel",
      options: {
        isDestructive: true,
        opensAppToForeground: false,
      },
    },
  ]);

  Notifications.addNotificationResponseReceivedListener((response) => {
    if (response.actionIdentifier === "cancel-action") {
      handleCancelAction();
    }
  });

  // Custom function to handle "Cancel" action
  async function handleCancelAction() {
    if (notificationId) {
      await Notifications.dismissNotificationAsync(notificationId);
      if (onCancelNotification) onCancelNotification();
    }
  }

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.actionIdentifier === "cancel-action") {
          handleCancelAction();
        }
      },
    );
    return () => subscription.remove();
  }, [notificationId]);

  async function scheduleNotification() {
    if (status === "granted") {
      // Schedule the notification
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          categoryIdentifier: category, // Associate category
        },
        trigger: null,
      });

      if (id) setNotificationId(id);
    } else {
      console.log("Notification permissions not granted.");
    }
  }

  function customNotificationClose(fn: () => void) {
    if (fn) fn();
  }

  return {
    scheduleNotification,
    onCancelNotification: handleCancelAction,
    customNotificationClose,
  };
};
