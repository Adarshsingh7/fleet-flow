import { createContext, ReactNode, useContext, useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { requestPermissions } from "@/utils/requestPermissions";
import { useTheme } from "./themeContext";

const LOCATION_TASK_NAME = "background-location-task";
const GPSContext = createContext<null | {
  onStartTracking: () => void;
  onStopTracking: () => void;
}>(null);

interface GPSContextProviderProps {
  children: ReactNode;
}

const checkPermissions = async (): Promise<boolean> => {
  const { foreground, background } = await requestPermissions();
  return foreground && background;
};

const GPSContextProvider = ({ children }: GPSContextProviderProps) => {
  const { theme } = useTheme();
  useEffect(() => {
    async function start() {
      const permissions = await checkPermissions();
      if (!permissions) {
        console.log("permission not granted");
        return;
      }
      TaskManager.defineTask(
        LOCATION_TASK_NAME,
        async ({
          data,
          error,
        }: TaskManager.TaskManagerTaskBody<{
          locations: Location.LocationObject[];
        }>) => {
          if (error) {
            console.error("❌ Background location error:", error);
            return;
          }
          console.log(data);
          if (data) {
            console.log(
              "✅ Background Location Data:",
              data.locations[0].coords,
            );
          }
        },
      );
    }
    start();
  }, []);

  const startBackgroundTracking = async (): Promise<void> => {
    if (!(await checkPermissions())) {
      console.error("⚠️ Permissions denied");
      return;
    }

    try {
      const hasStarted =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (hasStarted) {
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
        showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: true,
        foregroundService: {
          notificationTitle: "Fleet Flow Tracking",
          notificationBody: "Your location is being tracked in the background.",
          notificationColor: theme.primary,
          killServiceOnDestroy: true,
        },
      });
    } catch (error) {
      console.error("❌ Error starting location updates:", error);
    }
  };

  const stopBackgroundTracking = async (): Promise<void> => {
    console.log("🛑 Stopping background tracking...");
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  };

  return (
    <GPSContext.Provider
      value={{
        onStartTracking: startBackgroundTracking,
        onStopTracking: stopBackgroundTracking,
      }}
    >
      {children}
    </GPSContext.Provider>
  );
};

export const useGPSLoc = () => {
  const context = useContext(GPSContext);
  if (!context) {
    throw new Error("useGPSLoc must be within GPSContextProvider");
  }
  return context;
};

export default GPSContextProvider;
