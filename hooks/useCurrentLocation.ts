import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import * as Device from "expo-device";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useQuery } from "@tanstack/react-query";
import { LocationType, UserType } from "@/app/types";
import { location as locationService } from "../features/location/location.service";

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  ); // State to store the current location
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State to store error messages
  const [isFetching, setIsFetching] = useState<boolean>(true); // State to indicate if location is being fetched
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null); // State to store the location subscription

  const locationRef = useRef<Location.LocationObject | null>(null); // Ref to store the current location

  // Fetch authenticated user data
  const { data: authUser } = useQuery<UserType>({ queryKey: ["user"] });
  // Fetch location data
  const { data: locationData } = useQuery<LocationType>({
    queryKey: ["location"],
  });

  // Function to stop location updates
  function stopLocationUpdates() {
    if (subscription) {
      locationRef.current = null;
      deactivateKeepAwake();
      subscription.remove();
      setSubscription(null);
      setIsFetching(false);
    }
  }

  // Function to start location updates
  async function startLocationUpdates() {
    if (Platform.OS === "android" && !Device.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Snack in an Android Emulator. Try it on your device!",
      );
      setIsFetching(false);
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setIsFetching(false);
      return;
    }

    activateKeepAwakeAsync();
    if (subscription == null) {
      const res = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          locationRef.current = newLocation;
          setIsFetching(false);
        },
      );
      setSubscription(res);
    }
  }

  // Cleanup effect to remove subscription on component unmount
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  // Effect to send location to the server at regular intervals
  useEffect(() => {
    async function sendLocation() {
      try {
        if (
          authUser?.role === "driver" &&
          locationRef.current &&
          locationData
        ) {
          await locationService.updateLocation(locationData._id, {
            latitude: locationRef.current.coords.latitude,
            longitude: locationRef.current.coords.longitude,
          });
        }
      } catch (error) {
        console.error("Failed to send location:", error);
      }
    }
    const intervalId = setInterval(sendLocation, 5000);

    return () => clearInterval(intervalId);
  }, [authUser, locationData]);

  return {
    location,
    errorMsg,
    isFetching,
    startLocationUpdates,
    stopLocationUpdates,
  };
}
