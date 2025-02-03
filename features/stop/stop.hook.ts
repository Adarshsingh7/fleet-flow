import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stop } from "./stop.service";

const useDisableStopStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (routeId: string) => stop.disableStopStatus(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stops"] });
    },
  });
  return mutation;
};

const useChangeStopStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      arrivalStatus,
    }: {
      id: string;
      arrivalStatus: "waiting" | "arrived";
    }) => stop.updateStop(id, { arrivalStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stops"] });
    },
  });
  return mutation;
};

export { useDisableStopStatus, useChangeStopStatus };
