import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stop } from "./stop.service";

// Custom hook to disable the stop status
const useDisableStopStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // Function to disable stop status
    mutationFn: (routeId: string) => stop.disableStopStatus(routeId),
    // Invalidate queries related to stops on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stops"] });
    },
  });
  return mutation;
};

// Custom hook to change the stop status
const useChangeStopStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // Function to update stop status
    mutationFn: ({
      id,
      arrivalStatus,
    }: {
      id: string;
      arrivalStatus: "waiting" | "arrived";
    }) => stop.updateStop(id, { arrivalStatus }),
    // Invalidate queries related to stops on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stops"] });
    },
  });
  return mutation;
};

export { useDisableStopStatus, useChangeStopStatus };
