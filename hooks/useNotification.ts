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

  // Set the notification handler to define how notifications should be handled
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Define a notification category with a "Cancel" action
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

  // Add a listener for notification responses
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

  // Effect to add and clean up the notification response listener
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

  // Function to schedule a notification
  async function scheduleNotification() {
    if (status === "granted") {
      // Schedule the notification with the provided content and category
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

  // Function to handle custom notification close action
  function customNotificationClose(fn: () => void) {
    if (fn) fn();
  }

  return {
    scheduleNotification,
    onCancelNotification: handleCancelAction,
    customNotificationClose,
  };
};
