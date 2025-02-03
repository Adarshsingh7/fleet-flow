import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";

export const useAirDropAnimation = () => {
  const animations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const [isAnimating, setIsAnimating] = useState(false);

  // Animation sequence for waves
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    // Reset animations
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    animations.forEach((anim) => anim.setValue(0));

    // Create staggered animations
    const createWaveAnimation = (animation: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(animation, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]);
    };

    // Start animations with different delays
    Animated.parallel(
      animations.map((animation, index) =>
        createWaveAnimation(animation, index * 666),
      ),
    ).start();
  }, []);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    animations.forEach((anim) => {
      anim.stopAnimation(() => anim.setValue(0));
    });
  }, []);

  return { startAnimation, stopAnimation, animations, isAnimating };
};
