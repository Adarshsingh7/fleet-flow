import { StyleSheet, View, Pressable, Text, Animated } from "react-native";
import { useAirDropAnimation } from "@/hooks/useAirDropAnimation";
import { useGPSNavigation } from "@/hooks/useGPSNavigation";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "../types";
import { useDisableStopStatus } from "@/features/stop/stop.hook";
import { useTheme } from "@/context/themeContext";
import { useGPSLoc } from "@/context/GPSContext";

export default function LocationPage() {
  // Hooks for animations, GPS navigation, user data, stop status, and theme
  const { animations, isAnimating, startAnimation, stopAnimation } =
    useAirDropAnimation();
  const { startGPSNavigationService, stopGPSNavigationService } =
    useGPSNavigation({ customFunction: stopAnimation });
  const { data: authUser } = useQuery<UserType>({ queryKey: ["user"] });
  const { mutate } = useDisableStopStatus();
  const { theme } = useTheme();
  const { onStartTracking, onStopTracking } = useGPSLoc();

  // Function to handle toggling location sharing
  function handleToggleLocationSharing() {
    // if (authUser?.role !== "driver")
    //   return alert("Only drivers can start the location sharing");
    if (!isAnimating) {
      const routeId = authUser?.route;
      if (routeId) {
        mutate(routeId);
      }
      // startGPSNavigationService();
      onStartTracking();
      startAnimation();
    } else {
      // stopGPSNavigationService();
      onStopTracking();
      stopAnimation();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Main circle container */}
      <View style={styles.circleContainer}>
        {/* Animated waves */}
        {animations.map((animation, index) => (
          <Animated.View
            key={index}
            style={[
              styles.wave,
              {
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2],
                    }),
                  },
                ],
                opacity: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 0],
                }),
                backgroundColor: theme.primary,
              },
            ]}
          />
        ))}

        {/* Center circle */}
        <View
          style={[styles.centerCircle, { backgroundColor: theme.primary }]}
        />
      </View>

      {/* Start button */}
      <Button onPress={handleToggleLocationSharing}>
        <Text style={[styles.buttonText, { color: "#fff" }]}>
          {!isAnimating ? "Start" : "Stop"}
        </Text>
      </Button>
    </View>
  );
}

// Button component with custom styles and theme
interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

const Button = ({ onPress, children }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.8 : 1, backgroundColor: theme.primary },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100, // Space for button at bottom
  },
  circleContainer: {
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "absolute",
  },
  wave: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "absolute",
  },
  button: {
    position: "absolute",
    bottom: 50,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
