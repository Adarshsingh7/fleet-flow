import { useCallback, useEffect } from "react";
import { useCurrentLocation } from "./useCurrentLocation";
import { useNotification } from "./useNotification";

interface Props {
  customFunction?: () => void;
}

export const useGPSNavigation = ({ customFunction }: Props) => {
  // Destructure necessary functions and variables from useCurrentLocation hook
  const {
    startLocationUpdates,
    stopLocationUpdates,
    location,
    isFetching,
    errorMsg,
  } = useCurrentLocation();

  // Destructure necessary functions from useNotification hook
  const { onCancelNotification, scheduleNotification } = useNotification({
    body: "sharing of live location is active",
    category: "location-sharing",
    title: "Location Sharing",
    onCancelNotification: customFunction,
  });

  // Function to start GPS navigation service
  const startGPSNavigationService = async () => {
    startLocationUpdates(); // Start location updates
    scheduleNotification(); // Schedule a notification
  };

  // Function to stop GPS navigation service
  const stopGPSNavigationService = () => {
    stopLocationUpdates(); // Stop location updates
    onCancelNotification(); // Cancel the notification
  };

  return { startGPSNavigationService, stopGPSNavigationService };
};
