import * as Location from "expo-location";

const requestPermissions = async () => {
  try {
    // Foreground permission request
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      throw new Error("Foreground location permission denied");
    }

    // Background permission request
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      throw new Error("Background location permission denied");
    }

    // Return karega ki permission mili ya nahi
    return {
      foreground: foregroundStatus === "granted",
      background: backgroundStatus === "granted",
    };
  } catch (error) {
    console.error("Error requesting location permissions:", error);
    return { foreground: false, background: false }; // ❌ Agar permission fail ho jaye toh false return karega
  }
};

export { requestPermissions };
