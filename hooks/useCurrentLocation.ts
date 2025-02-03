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
  ); // adding the location service demand from the user
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // storing the error messages if occoured in the fetching location process
  const [isFetching, setIsFetching] = useState<boolean>(true); // stores the state of the fetching location
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null); // creates the subscription for location which can later be removed

  const locationRef = useRef<Location.LocationObject | null>(null); // stores the reference for the location used for sending location in use effects

  const { data: authUser } = useQuery<UserType>({ queryKey: ["user"] });
  const { data: locationData } = useQuery<LocationType>({
    queryKey: ["location"],
  });

  function stopLocationUpdates() {
    if (subscription) {
      locationRef.current = null;
      deactivateKeepAwake();
      subscription.remove();
      setSubscription(null);
      setIsFetching(false);
    }
  }

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

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

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
